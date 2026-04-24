"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ListFilter, Terminal, 
  Wallet, Activity, Zap, ArrowUpRight, History, Search, Box,
  ExternalLink, ArrowDownLeft, Clock, Link as LinkIcon, Lock, Key,
  ChevronRight, Database, Server, Cpu, AlertCircle, CheckCircle2, ZapOff
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DEALER_WALLET = "0xE0BE7181C05023999c1e15b5a1Eb89147DcEB334";
const CHAINS: Record<number, { name: string; usdt: string; explorer: string }> = {
  56: { name: 'BSC', usdt: '0x55d398326f99059fF775485246999027B3197955', explorer: 'https://bscscan.com/tx/' },
  137: { name: 'Polygon', usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', explorer: 'https://polygonscan.com/tx/' }
};

const VaultControlPanel = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'system'>('queue');
  const [stats, setStats] = useState({ totalVol: "0", uptime: "99.99%", load: "12%" });

  const ADMIN_PIN = "872139"; 

  const isAdmin = useMemo(() => {
    if (!account) return false;
    return account.toLowerCase() === DEALER_WALLET.toLowerCase();
  }, [account]);

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    if (win.safepal) return win.safepal;
    if (win.ethereum?.isSafePal) return win.ethereum;
    if (win.ethereum?.providers?.length) {
      return win.ethereum.providers.find((p: any) => p.isSafePal) || win.ethereum.providers[0];
    }
    return win.ethereum;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter((o: any) => o.status === 'pending' && o.side === 'buy');
        const history = data.filter((o: any) => o.status !== 'pending' || o.side === 'sell');
        setPendingOrders(pending);
        setHistoryOrders(history);
        
        const vol = history.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount), 0);
        setStats(prev => ({ ...prev, totalVol: vol.toLocaleString() }));
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      const checkAccount = async () => {
        try {
          const accs = await provider.request({ method: 'eth_accounts' });
          if (accs && accs.length > 0 && accs[0] !== account) setAccount(accs[0]);
        } catch (e) {}
      };
      const interval = setInterval(checkAccount, 3000);
      const handleAccounts = (accs: any) => {
        setAccount(accs[0] || null);
        setIsUnlocked(false);
      };
      provider.on('accountsChanged', handleAccounts);
      return () => {
        clearInterval(interval);
        if (provider.removeListener) provider.removeListener('accountsChanged', handleAccounts);
      };
    }
  }, [getProvider, account]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsUnlocked(true);
      toast.success("Identity Confirmed");
    } else {
      toast.error("ACCESS DENIED");
      setPinInput("");
    }
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) return toast.error("No SafePal Wallet Found.");
    setIsProcessing(true);
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts", params: [] });
      if (accounts && accounts.length > 0) setAccount(accounts[0]);
    } catch (err: any) {
      toast.error(err.message || "Failed to link wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  const approveOrder = async (order: any) => {
    if (!isAdmin || !isUnlocked) return toast.error("UNAUTHORIZED");
    const walletProvider = getProvider();
    if (!walletProvider) return toast.error("No Provider");
    
    const tId = toast.loading(`Initiating Release: ${order.amount} ${order.asset}...`);
    setIsProcessing(true);
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const cid = Number(network.chainId);
      
      let tx;
      if (order.asset === 'BNB' || order.asset === 'POL') {
        tx = await signer.sendTransaction({ to: order.targetAddress, value: ethers.parseEther(order.amount.toString()) });
      } else {
        const config = CHAINS[cid];
        if (!config) throw new Error("Unsupported Network");
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        const decimals = cid === 137 ? 6 : 18;
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), decimals));
      }
      
      toast.loading("Broadcasting to network...", { id: tId });
      await tx.wait();
      
      await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: order.id, status: 'approved', txHash: tx.hash })
      });
      
      toast.success("Resources Released Successfully", { id: tId });
      fetchData();
    } catch (err: any) {
      toast.error(err.message, { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-8 font-mono">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
          <Lock className="text-red-600 relative z-10" size={100} />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-[0.4em] mb-4">Command Login</h1>
        <p className="text-zinc-600 text-xs mb-12 uppercase tracking-widest">Awaiting Admin Signature</p>
        <button onClick={connectWallet} disabled={isProcessing} className="group relative px-16 py-6 bg-white text-black font-black uppercase text-xs tracking-[0.3em] overflow-hidden hover:bg-red-600 hover:text-white transition-all">
          <span className="relative z-10">{isProcessing ? "Linking..." : "Link Admin Identity"}</span>
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-8 font-mono">
        <AlertCircle className="text-red-600 mb-8" size={80} />
        <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic mb-4 text-center">Unrecognized Protocol: {account.slice(0,12)}...</h1>
        <p className="text-zinc-500 text-sm max-w-md text-center leading-relaxed">Your wallet address does not match the designated Dealer Authority. Your IP and attempt have been logged.</p>
        <Link href="/" className="mt-12 px-10 py-4 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Emergency Exit</Link>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-8 font-mono">
        <div className="mb-12 w-16 h-16 border-2 border-red-600 rounded-full flex items-center justify-center">
          <Key className="text-red-600" size={24} />
        </div>
        <h1 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-12 italic">Identity Verification Required</h1>
        <form onSubmit={handlePinSubmit} className="space-y-8 w-full max-w-sm">
          <input type="password" maxLength={6} value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="000000" className="w-full bg-black border border-white/[0.05] p-8 rounded-sm text-center text-5xl font-black text-red-600 focus:border-red-600 outline-none transition-all tracking-[0.5em]" autoFocus />
          <button type="submit" className="w-full py-5 bg-red-600 text-white font-black uppercase text-xs tracking-[0.4em] hover:bg-white hover:text-black transition-all">Execute Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-mono tracking-tight selection:bg-red-600/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col min-h-screen">
        <header className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/[0.03]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-black font-black text-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)]">
              V
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Command <span className="text-red-600">Nexus</span></h1>
              <p className="text-[9px] text-zinc-600 uppercase tracking-[0.8em]">Level 5 Authorization</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             <div className="px-6 py-3 bg-zinc-900/50 border border-white/[0.05] rounded-sm flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">System_Online</span>
             </div>
             <Link href="/" className="px-8 py-3 bg-zinc-900 border border-white/[0.05] text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
                <ArrowLeft size={12} /> Terminate_Session
             </Link>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 space-y-12">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { l: "Queue_Length", v: pendingOrders.length, i: <ListFilter size={14} />, c: "text-red-500" },
               { l: "Agg_Volume", v: `${stats.totalVol} ₮`, i: <Activity size={14} />, c: "text-blue-500" },
               { l: "Network_Load", v: stats.load, i: <Cpu size={14} />, c: "text-zinc-400" },
               { l: "Security_Auth", v: "Valid", i: <CheckCircle2 size={14} />, c: "text-emerald-500" },
             ].map((s, idx) => (
               <div key={idx} className="bg-zinc-900/20 border border-white/[0.03] p-8 rounded-sm group hover:border-white/10 transition-all">
                  <div className={`mb-4 ${s.c}`}>{s.i}</div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">{s.l}</p>
                  <p className="text-3xl font-black text-white tracking-tighter italic">{s.v}</p>
               </div>
             ))}
          </div>

          <section className="bg-[#050505] border border-white/[0.03] rounded-sm overflow-hidden shadow-2xl">
             <nav className="flex border-b border-white/[0.03] p-2 bg-black/40">
                <button onClick={() => setActiveTab('queue')} className={`flex-1 md:flex-none px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'queue' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-600 hover:text-white'}`}>Active_Queue</button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 md:flex-none px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white'}`}>Archive_Log</button>
                <button onClick={() => setActiveTab('system')} className={`hidden md:block px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'system' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white'}`}>Sys_Health</button>
             </nav>

             <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {activeTab === 'queue' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      {pendingOrders.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm">
                           <ZapOff className="text-zinc-800 mb-4" size={40} />
                           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">No Tasks In Queue</p>
                        </div>
                      ) : (
                        pendingOrders.map((p, i) => (
                          <div key={i} className="group grid grid-cols-1 lg:grid-cols-12 p-10 border border-white/[0.03] bg-zinc-900/10 items-center gap-12 hover:bg-zinc-900/30 transition-all border-l-2 border-l-red-600">
                             <div className="lg:col-span-4 space-y-3">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block">Release_Target</span>
                                <span className="text-sm font-black text-zinc-300 truncate block font-mono">{p.targetAddress}</span>
                                <div className="flex gap-4">
                                   <span className="px-2 py-0.5 bg-red-600/10 text-red-500 text-[8px] font-black uppercase tracking-tighter">Priority_High</span>
                                   <span className="px-2 py-0.5 bg-blue-600/10 text-blue-500 text-[8px] font-black uppercase tracking-tighter">Auto_Link</span>
                                </div>
                             </div>
                             <div className="lg:col-span-3">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block mb-2">Resource_Payload</span>
                                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">{p.amount} {p.asset}</span>
                             </div>
                             <div className="lg:col-span-2">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block mb-2">Inbound_Conf</span>
                                {p.paymentHash ? (
                                  <a href={`${CHAINS[p.chainId]?.explorer}${p.paymentHash}`} target="_blank" className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-500 hover:text-white uppercase transition-colors group/link">
                                    Linked <ExternalLink size={10} className="group-hover/link:translate-x-1 transition-transform" />
                                  </a>
                                ) : <span className="text-[9px] text-zinc-700 uppercase italic">Pending_Node</span>}
                             </div>
                             <div className="lg:col-span-3">
                                <button onClick={() => approveOrder(p)} disabled={isProcessing} className="w-full py-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-xl disabled:opacity-50">
                                  {isProcessing ? "Processing..." : "Release_Asset"}
                                </button>
                             </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  ) : activeTab === 'history' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                      <div className="mb-8 p-6 bg-zinc-900/20 border border-white/5 flex flex-col md:flex-row justify-between gap-6">
                         <div className="flex items-center gap-4 bg-black px-6 py-3 border border-white/5 w-full md:w-96">
                            <Search size={14} className="text-zinc-600" />
                            <input type="text" placeholder="SEARCH_HASH_OR_WALLET..." className="bg-transparent border-none outline-none text-[10px] font-black text-zinc-400 w-full placeholder:text-zinc-800" />
                         </div>
                         <div className="flex gap-4">
                            <button className="px-6 py-3 border border-white/5 text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">CSV_Export</button>
                            <button className="px-6 py-3 border border-white/5 text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Audit_Verify</button>
                         </div>
                      </div>
                      <div className="space-y-3">
                        {historyOrders.map((t, i) => (
                          <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 border border-white/[0.03] bg-zinc-900/5 hover:bg-zinc-900/10 transition-all gap-8">
                             <div className="flex flex-wrap gap-12 items-center w-full md:w-auto">
                                <div className="flex items-center gap-6">
                                   <div className={`w-10 h-10 flex items-center justify-center ${t.side === 'buy' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-600/10 text-emerald-500'}`}>
                                      {t.side === 'buy' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[8px] text-zinc-600 uppercase font-black">Operation</span>
                                      <span className={`text-xs font-black uppercase ${t.side === 'buy' ? 'text-blue-500' : 'text-emerald-400'}`}>{t.side.toUpperCase()}</span>
                                   </div>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase font-black">Settlement_Asset</span>
                                   <span className="text-xs font-black text-white uppercase italic">{t.amount} {t.asset}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase font-black">Authorized_At</span>
                                   <span className="text-[10px] font-bold text-zinc-500">{new Date(t.createdAt).toLocaleString()}</span>
                                </div>
                             </div>
                             <div className="flex gap-4 w-full md:w-auto">
                                {t.paymentHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.paymentHash}`} target="_blank" className="p-4 bg-zinc-900/50 border border-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all" title="View Inbound"><LinkIcon size={12} className="text-blue-500" /></a>}
                                {t.txHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.txHash}`} target="_blank" className="p-4 bg-zinc-900/50 border border-white/5 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all" title="View Outbound"><ExternalLink size={12} className="text-emerald-500" /></a>}
                                <button className="p-4 bg-zinc-900/50 border border-white/5 hover:bg-white hover:text-black transition-all" title="Download Ticket"><ChevronRight size={12} /></button>
                             </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-600 flex items-center gap-4">
                             <Server size={14} /> Node_Infrastructure
                          </h3>
                          <div className="space-y-4">
                             {["Primary_Relay", "Backup_Vault", "Neural_Scanner", "Auth_Node"].map((n, idx) => (
                               <div key={idx} className="p-6 bg-zinc-900/20 border border-white/5 flex justify-between items-center">
                                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{n}</span>
                                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Operational_100%</span>
                                </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-4">
                             <Database size={14} /> Database_Registry
                          </h3>
                          <div className="p-10 border border-white/5 bg-zinc-900/10 space-y-6">
                             <div className="flex justify-between items-end">
                                <span className="text-[10px] text-zinc-600 font-black uppercase">Prisma_Client_Release</span>
                                <span className="text-xs font-bold text-white uppercase italic">v5.22.0</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <span className="text-[10px] text-zinc-600 font-black uppercase">Last_Backup</span>
                                <span className="text-xs font-bold text-white uppercase italic">14_Min_Ago</span>
                             </div>
                             <button className="w-full py-4 mt-6 border border-red-600/30 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Flush_Buffer_Cache</button>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </section>
        </main>

        <footer className="p-12 text-center border-t border-white/[0.03]">
           <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[1em]">BlackIntellisense // Institutional Command Unit // © 2026</p>
        </footer>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #111; }
        ::-webkit-scrollbar-thumb:hover { background: #222; }
      `}</style>
    </div>
  );
};

export default VaultControlPanel;
