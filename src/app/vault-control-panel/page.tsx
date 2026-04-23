"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ListFilter, Terminal, 
  Wallet, Activity, Zap, ArrowUpRight, History, Search, Box,
  ExternalLink, ArrowDownLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

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
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Pending: Only BUYs that need Vault to send assets back
        setPendingOrders(data.filter((o: any) => o.status === 'pending' && o.side === 'buy'));
        // History: Everything else (Approved BUYs and all SELLs)
        setHistoryOrders(data.filter((o: any) => o.status !== 'pending' || o.side === 'sell'));
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider.request({ method: 'eth_accounts' }).then((accs: string[]) => {
        if (accs.length > 0) setAccount(accs[0]);
      });
      provider.on('accountsChanged', (accs: any) => {
          setAccount(accs[0] || null);
          setIsUnlocked(false);
      });
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [getProvider, fetchData]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsUnlocked(true);
      toast.success("Identity Verified: Welcome Commander");
    } else {
      toast.error("INVALID PIN: ACCESS DENIED");
      setPinInput("");
    }
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) return toast.error("No Web3 Wallet Found. Please install SafePal or MetaMask.");
    
    setIsProcessing(true);
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success("Admin Node Linked");
      }
    } catch (err: any) {
      toast.error(err.message || "Authorization Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const approveOrder = async (order: any) => {
    if (!isAdmin || !isUnlocked) return toast.error("ACCESS DENIED");
    
    const walletProvider = getProvider();
    if (!walletProvider) return toast.error("No Provider Found");

    setIsProcessing(true);
    const tId = toast.loading(`AUTHORIZING: Dispatching ${order.asset} to Client...`);
    
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
        if (!config) throw new Error("Switch to BSC or Polygon in your wallet");
        // For Buy dispatch, Admin sends the asset (e.g. Gold/Pair) to client
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), 18));
      }
      
      await tx.wait();
      
      await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id: order.id,
              status: 'approved',
              txHash: tx.hash
          })
      });

      toast.success("Liquidity Dispatched Successfully", { id: tId });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Execution Failed", { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-zinc-900/40 border border-white/5 p-12 rounded-[3rem] text-center space-y-10 backdrop-blur-xl shadow-2xl">
          <ShieldCheck className="text-blue-500 mx-auto" size={80} />
          <div className="space-y-4">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Vault Nexus</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Institutional Bridge Gateway</p>
          </div>
          <button onClick={connectWallet} className="w-full py-5 bg-white text-black text-[11px] font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">Authenticate Admin Identity</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 p-12 rounded-[3rem] text-center space-y-8 backdrop-blur-xl">
          <Terminal className="mx-auto text-red-500" size={64} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-red-500">Unrecognized Node</h1>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">Access restricted to Authoritative Signers only.</p>
          <Link href="/intellitrade" className="inline-block px-8 py-3 border border-white/10 text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-all rounded-xl">Eject Session</Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-zinc-900/40 border border-red-500/20 p-12 rounded-[3rem] text-center space-y-10 backdrop-blur-xl">
          <Zap className="text-red-500 mx-auto" size={32} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Entry Protocol</h1>
          <form onSubmit={handlePinSubmit} className="space-y-8">
            <input type="password" maxLength={6} value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••••" className="w-full bg-black/50 border border-white/5 p-8 rounded-[2rem] text-center text-4xl font-black tracking-[0.5em] text-red-500 focus:border-red-600 focus:bg-black transition-all outline-none" autoFocus />
            <button type="submit" className="w-full py-5 bg-red-600 text-white text-[11px] font-black uppercase rounded-2xl hover:bg-white hover:text-black transition-all shadow-lg shadow-red-600/20">Verify Authority</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 font-sans selection:bg-red-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-12 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)] rotate-3"><Box size={40} className="text-white" /></div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">VAULT <span className="text-red-600">COMMAND</span></h1>
              <p className="text-[9px] tracking-[0.8em] text-zinc-600 uppercase mt-2">Institutional Nexus Protocol v6.5</p>
            </div>
          </div>
          <Link href="/intellitrade" className="px-8 py-4 bg-zinc-900/50 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-2xl flex items-center gap-3"><ArrowLeft size={16} /> Exit</Link>
        </header>

        <main className="space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
                 <ArrowDownLeft className="text-blue-500 mb-6" size={32} />
                 <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">Incoming (BUY Requests)</p>
                 <p className="text-5xl font-black text-white italic">{pendingOrders.length}</p>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
                 <ArrowUpRight className="text-emerald-500 mb-6" size={32} />
                 <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">Outgoing (Total Settled)</p>
                 <p className="text-5xl font-black text-white italic">{historyOrders.length}</p>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md border-emerald-500/20">
                 <Activity className="text-emerald-500 mb-6" size={32} />
                 <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">Network Load</p>
                 <p className="text-xl font-black text-emerald-400 uppercase italic">Operational: High Secure</p>
              </div>
           </div>

           <section className="bg-zinc-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-xl">
              <nav className="flex border-b border-white/5 p-4 gap-4 bg-black/20">
                 <button onClick={() => setActiveTab('queue')} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Pending Actions</button>
                 <button onClick={() => setActiveTab('history')} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Audit History (In/Out)</button>
              </nav>

              <div className="p-8 lg:p-12">
                 {activeTab === 'queue' ? (
                   <div className="space-y-6">
                      {pendingOrders.length === 0 ? (
                        <div className="py-32 text-center space-y-4"><Search className="mx-auto text-zinc-800" size={48} /><p className="text-zinc-700 uppercase text-[10px] font-black tracking-[0.5em]">No pending transactions</p></div>
                      ) : (
                        pendingOrders.map((p, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-10 border border-white/5 bg-black/40 items-center rounded-[2.5rem] gap-8 hover:border-red-500/30 transition-all group">
                             <div className="md:col-span-2 space-y-1"><span className="text-[8px] text-zinc-600 uppercase font-black block">Batch ID</span><span className="text-xs font-bold text-red-500 font-mono uppercase">{p.id.slice(0,8)}</span></div>
                             <div className="md:col-span-3 space-y-1"><span className="text-[8px] text-zinc-600 uppercase font-black block">Recipient Wallet</span><span className="text-[10px] font-bold text-zinc-400 truncate block font-mono">{p.targetAddress}</span></div>
                             <div className="md:col-span-2 space-y-1"><span className="text-[8px] text-zinc-600 uppercase font-black block">Resource / Qty</span><span className="text-sm font-black text-white uppercase italic">{p.amount} {p.asset}</span></div>
                             <div className="md:col-span-2 space-y-1"><span className="text-[8px] text-zinc-600 uppercase font-black block">Client Payment</span><a href={`${CHAINS[p.chainId]?.explorer}${p.paymentHash}`} target="_blank" className="text-[10px] font-bold text-blue-500 truncate block hover:text-white underline decoration-blue-500/30 font-mono italic">INCOMING TX</a></div>
                             <div className="md:col-span-3"><button onClick={() => approveOrder(p)} disabled={isProcessing} className="w-full py-5 bg-red-600 text-white text-[11px] font-black uppercase rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 group-hover:scale-[1.02]">{isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <><ArrowUpRight size={16} /> Dispatch Asset</>}</button></div>
                          </div>
                        ))
                      )}
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {historyOrders.map((t, i) => (
                        <div key={i} className={`flex justify-between items-center p-6 border border-white/5 rounded-3xl ${t.side === 'buy' ? 'bg-blue-500/5' : 'bg-emerald-500/5'}`}>
                           <div className="flex gap-10 items-center">
                              <div className="flex items-center gap-4">
                                 {t.side === 'buy' ? <ArrowDownLeft className="text-blue-500" size={20} /> : <ArrowUpRight className="text-emerald-500" size={20} />}
                                 <div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Operation</span><span className={`text-[10px] font-black uppercase ${t.side === 'buy' ? 'text-blue-500' : 'text-emerald-500'}`}>{t.side === 'buy' ? 'INCOMING (BUY)' : 'OUTGOING (SELL)'}</span></div>
                              </div>
                              <div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Value Settled</span><span className="text-xs font-black text-white">{t.amount} {t.asset}</span></div>
                              <div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Timestamp</span><span className="text-[10px] font-bold text-zinc-500 font-mono">{new Date(t.createdAt).toLocaleString()}</span></div>
                           </div>
                           <div className="flex gap-3">
                              {t.paymentHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.paymentHash}`} target="_blank" className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[8px] font-black uppercase hover:bg-white hover:text-black transition-all">Client Pay</a>}
                              {t.txHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.txHash}`} target="_blank" className="px-4 py-2 bg-zinc-800 border border-white/5 rounded-xl text-[8px] font-black uppercase hover:bg-white hover:text-black transition-all">Vault Send</a>}
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </section>
        </main>
        <footer className="h-10 border-t border-white/5 flex items-center justify-between text-[8px] font-bold text-zinc-800 uppercase tracking-[0.5em] font-mono italic"><span>Vault Node v.6.5 SECURED</span><span>Institutional Protocol Verified</span></footer>
      </div>
    </div>
  );
};

export default VaultControlPanel;
