"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ListFilter, Terminal, 
  Wallet, Activity, Zap, ArrowUpRight, History, Search, Box,
  ExternalLink, ArrowDownLeft, Clock, Link as LinkIcon, Lock, Key,
  ChevronRight, Database, Server, Cpu, AlertCircle, CheckCircle2,
  ZapOff, XCircle, Trash2
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
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'system'>('queue');
  const [searchQuery, setSearchQuery] = useState("");

  const ADMIN_PIN = "872139"; 

  const isAdmin = useMemo(() => {
    if (!account) return false;
    return account.toLowerCase() === DEALER_WALLET.toLowerCase();
  }, [account]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) {
        const data = await res.json();
        setAllOrders(data);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    }
  }, []);

  const pendingOrders = useMemo(() => 
    allOrders.filter(o => o.status === 'pending' && (o.targetAddress.includes(searchQuery.toLowerCase()) || o.asset.includes(searchQuery.toUpperCase()))),
  [allOrders, searchQuery]);

  const historyOrders = useMemo(() => 
    allOrders.filter(o => o.status !== 'pending' && (o.targetAddress.includes(searchQuery.toLowerCase()) || o.asset.includes(searchQuery.toUpperCase()))),
  [allOrders, searchQuery]);

  const stats = useMemo(() => {
    const vol = allOrders.filter(o => o.status === 'approved').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    return {
      totalVol: vol.toLocaleString(),
      pending: allOrders.filter(o => o.status === 'pending').length,
      success: allOrders.filter(o => o.status === 'approved').length,
      failed: allOrders.filter(o => o.status === 'rejected').length
    };
  }, [allOrders]);

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    return win.safepal || (win.ethereum?.isSafePal ? win.ethereum : win.ethereum);
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      const handleAccounts = (accs: any) => {
        setAccount(accs[0] || null);
        setIsUnlocked(false);
      };
      provider.on('accountsChanged', handleAccounts);
      provider.request({ method: 'eth_accounts' }).then((accs: any) => setAccount(accs[0] || null));
      return () => provider.removeListener('accountsChanged', handleAccounts);
    }
  }, [getProvider]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAction = async (orderId: string, status: 'approved' | 'rejected') => {
    if (!isAdmin || !isUnlocked) return toast.error("UNAUTHORIZED");
    
    const tId = toast.loading(`${status === 'approved' ? 'Approving' : 'Declining'} task...`);
    setIsProcessing(true);
    
    try {
      let txHash = null;

      if (status === 'approved') {
        const order = allOrders.find(o => o.id === orderId);
        const provider = new ethers.BrowserProvider(getProvider());
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const cid = Number(network.chainId);
        
        let tx;
        if (order.asset === 'BNB') {
          tx = await signer.sendTransaction({ to: order.targetAddress, value: ethers.parseEther(order.amount.toString()) });
        } else {
          const config = CHAINS[cid];
          if (!config) throw new Error("Switch to BSC/Polygon");
          const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
          const decimals = cid === 137 ? 6 : 18;
          tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), decimals));
        }
        await tx.wait();
        txHash = tx.hash;
      }

      await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId, status, txHash })
      });
      
      toast.success(`Task ${status.toUpperCase()}`, { id: tId });
      fetchData();
    } catch (err: any) {
      toast.error(err.message, { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-8 font-mono">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
          <Lock className="text-red-600 relative z-10" size={100} />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-8">Dealer Authority Required</h1>
        <button onClick={async () => {
          const p = getProvider();
          if (p) {
             const accs = await p.request({ method: 'eth_requestAccounts' });
             setAccount(accs[0]);
          }
        }} className="px-16 py-6 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all">Link Admin Wallet</button>
        {account && !isAdmin && <p className="mt-8 text-red-500 text-[10px] font-black uppercase tracking-widest animate-bounce">Access Denied: Non-Dealer Wallet</p>}
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-8 font-mono text-center">
        <Key className="text-red-600 mb-12" size={48} />
        <h1 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-12">Enter Protocol Pin</h1>
        <form onSubmit={(e) => { e.preventDefault(); if(pinInput === ADMIN_PIN) setIsUnlocked(true); else toast.error("WRONG PIN"); }} className="space-y-8 w-full max-w-sm">
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
            <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-black font-black text-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)]">V</div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Command <span className="text-red-600">Nexus</span></h1>
              <p className="text-[9px] text-zinc-600 uppercase tracking-[0.8em]">Level 5 Authorization</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             <div className="px-6 py-3 bg-zinc-900/50 border border-white/[0.05] rounded-sm flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Node_Active</span>
             </div>
             <Link href="/intellitrade" className="px-8 py-3 bg-zinc-900 border border-white/[0.05] text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
                <ArrowLeft size={12} /> Terminate_Session
             </Link>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { l: "Incoming_Tasks", v: stats.pending, i: <ListFilter size={14} />, c: "text-red-500" },
               { l: "Successful_Vol", v: `${stats.totalVol} ₮`, i: <Activity size={14} />, c: "text-blue-500" },
               { l: "Closed_Sessions", v: stats.success, i: <CheckCircle2 size={14} />, c: "text-emerald-500" },
               { l: "Rejected_Logs", v: stats.failed, i: <XCircle size={14} />, c: "text-zinc-600" },
             ].map((s, idx) => (
               <div key={idx} className="bg-zinc-900/20 border border-white/[0.03] p-8 rounded-sm group hover:border-white/10 transition-all">
                  <div className={`mb-4 ${s.c}`}>{s.i}</div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">{s.l}</p>
                  <p className="text-3xl font-black text-white tracking-tighter italic">{s.v}</p>
               </div>
             ))}
          </div>

          <section className="bg-[#050505] border border-white/[0.03] rounded-sm overflow-hidden shadow-2xl">
             <nav className="flex flex-wrap border-b border-white/[0.03] p-2 bg-black/40">
                <button onClick={() => setActiveTab('queue')} className={`flex-1 md:flex-none px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'queue' ? 'bg-red-600 text-white' : 'text-zinc-600 hover:text-white'}`}>Active_Queue</button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 md:flex-none px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white'}`}>Archive_Log</button>
                <button onClick={() => setActiveTab('system')} className={`hidden md:block px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'system' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white'}`}>Sys_Health</button>
                
                <div className="flex-1 flex items-center px-8 border-l border-white/5">
                   <Search size={14} className="text-zinc-700 mr-4" />
                   <input type="text" placeholder="FILTER_BY_WALLET_OR_ASSET..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-zinc-400 w-full" />
                </div>
             </nav>

             <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {activeTab === 'queue' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {pendingOrders.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm">
                           <ZapOff className="text-zinc-900 mb-4" size={40} />
                           <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.4em]">Queue_Empty</p>
                        </div>
                      ) : (
                        pendingOrders.map((p, i) => (
                          <div key={i} className="grid grid-cols-1 lg:grid-cols-12 p-10 border border-white/[0.03] bg-zinc-900/10 items-center gap-12 border-l-2 border-l-red-600">
                             <div className="lg:col-span-4 flex flex-col">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-2">Request_Target</span>
                                <span className="text-xs font-black text-zinc-300 truncate font-mono">{p.targetAddress}</span>
                             </div>
                             <div className="lg:col-span-3">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-2">Payload_Resource</span>
                                <span className="text-2xl font-black text-white italic tracking-tighter">{p.amount} {p.asset}</span>
                             </div>
                             <div className="lg:col-span-2">
                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-2">Verification</span>
                                {p.paymentHash ? <a href={`${CHAINS[p.chainId]?.explorer}${p.paymentHash}`} target="_blank" className="text-[9px] font-black text-emerald-500 hover:text-white uppercase transition-colors flex items-center gap-2">Linked <ExternalLink size={10} /></a> : <span className="text-[9px] text-zinc-800">No_Payment_Linked</span>}
                             </div>
                             <div className="lg:col-span-3 flex gap-2">
                                <button onClick={() => handleAction(p.id, 'approved')} disabled={isProcessing} className="flex-1 py-5 bg-white text-black text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50">Approve</button>
                                <button onClick={() => handleAction(p.id, 'rejected')} disabled={isProcessing} className="px-6 py-5 border border-white/5 text-zinc-600 hover:text-red-500 transition-all disabled:opacity-50"><XCircle size={16} /></button>
                             </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  ) : activeTab === 'history' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        {historyOrders.map((t, i) => (
                          <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 border border-white/[0.03] bg-black hover:bg-zinc-900/10 transition-all gap-8">
                             <div className="flex flex-wrap gap-12 items-center">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-sm ${t.status === 'approved' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-red-600/10 text-red-500'}`}>
                                   {t.status === 'approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase font-black">Ticket_ID</span>
                                   <span className="text-[10px] font-black text-white font-mono uppercase">{t.id.slice(0,10)}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase font-black">Operation_Payload</span>
                                   <span className="text-xs font-black text-white italic">{t.amount} {t.asset}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-zinc-600 uppercase font-black">Authorized_At</span>
                                   <span className="text-[10px] font-bold text-zinc-500">{new Date(t.createdAt).toLocaleString()}</span>
                                </div>
                             </div>
                             <div className="flex gap-3">
                                {t.paymentHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.paymentHash}`} target="_blank" className="p-4 bg-zinc-900 border border-white/5 hover:border-emerald-500 transition-all" title="View Inbound"><LinkIcon size={12} /></a>}
                                {t.txHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.txHash}`} target="_blank" className="p-4 bg-zinc-900 border border-white/5 hover:border-emerald-500 transition-all" title="View Outbound"><ExternalLink size={12} /></a>}
                             </div>
                          </div>
                        ))}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-red-600 flex items-center gap-4"><Server size={14} /> Node_Infrastructure</h3>
                          <div className="space-y-4">
                             {["Primary_Relay", "Backup_Vault", "Neural_Scanner", "Auth_Node"].map((n, idx) => (
                               <div key={idx} className="p-6 bg-zinc-900/20 border border-white/5 flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{n}</span><span className="text-[9px] font-black text-emerald-500">Operational_100%</span></div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-4"><Database size={14} /> Database_Status</h3>
                          <div className="p-10 border border-white/5 bg-zinc-900/10 space-y-6">
                             <div className="flex justify-between items-end"><span className="text-[10px] text-zinc-600 font-black uppercase">Provider</span><span className="text-xs font-bold text-white italic">Supabase_AWS</span></div>
                             <div className="flex justify-between items-end"><span className="text-[10px] text-zinc-600 font-black uppercase">State</span><span className="text-xs font-bold text-emerald-500 italic">Synchronized</span></div>
                             <button onClick={fetchData} className="w-full py-4 mt-6 border border-emerald-600/30 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"><RefreshCw size={10} /> Force_Sync</button>
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
    </div>
  );
};

export default VaultControlPanel;
