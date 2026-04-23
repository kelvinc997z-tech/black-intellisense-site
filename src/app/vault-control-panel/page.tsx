"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ListFilter, Terminal, 
  Wallet, Activity, Zap, ArrowUpRight, History, Search, Box,
  ExternalLink, ArrowDownLeft, Clock, Link as LinkIcon
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
    
    // Explicit priority for SafePal
    if (win.safepal) return win.safepal;
    if (win.ethereum?.isSafePal) return win.ethereum;
    
    // If multiple providers exist (like MetaMask + SafePal)
    if (win.ethereum?.providers?.length) {
      return win.ethereum.providers.find((p: any) => p.isSafePal) || win.ethereum.providers[0];
    }
    
    return win.ethereum;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        const pending = [];
        const history = [];
        for (const o of data) {
          if (o.status === 'pending' && o.side === 'buy') {
            pending.push(o);
          } else {
            history.push(o);
          }
        }
        setPendingOrders(pending);
        setHistoryOrders(history);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      // Periodic check for account in case events fail
      const checkAccount = async () => {
        try {
          const accs = await provider.request({ method: 'eth_accounts' });
          if (accs && accs.length > 0 && accs[0] !== account) {
            setAccount(accs[0]);
          }
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
      toast.success("Identity Verified");
    } else {
      toast.error("INVALID PIN");
      setPinInput("");
    }
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) return toast.error("No SafePal Wallet Found.");
    
    setIsProcessing(true);
    try {
      // Some versions of SafePal respond better to a direct request with params
      const accounts = await provider.request({ 
        method: "eth_requestAccounts",
        params: []
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success("Admin Linked");
      }
    } catch (err: any) {
      console.error("SafePal Connection Error:", err);
      toast.error(err.message || "Failed to call wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  const approveOrder = async (order: any) => {
    if (!isAdmin || !isUnlocked) return toast.error("DENIED");
    const walletProvider = getProvider();
    if (!walletProvider) return toast.error("No Wallet");
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
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), 18));
      }
      await tx.wait();
      await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: order.id, status: 'approved', txHash: tx.hash })
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-8">
        <ShieldCheck className="text-blue-500 mb-8" size={80} />
        <h1 className="text-2xl font-black text-white uppercase italic mb-8">Vault Admin Login</h1>
        <button onClick={connectWallet} disabled={isProcessing} className="px-12 py-5 bg-white text-black font-black uppercase rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
          {isProcessing ? "Opening SafePal..." : "Open SafePal"}
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-8">
        <Terminal className="text-red-500 mb-6" size={64} />
        <h1 className="text-xl font-black text-red-500 uppercase italic">Unauthorized: {account.slice(0,10)}...</h1>
        <Link href="/intellitrade" className="mt-8 px-6 py-3 border border-white/10 text-xs font-black uppercase text-zinc-400 hover:text-white transition-all rounded-xl">Back</Link>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-8">
        <Zap className="text-red-500 mb-8" size={40} />
        <h1 className="text-2xl font-black text-white uppercase italic mb-8">Secure PIN</h1>
        <form onSubmit={handlePinSubmit} className="space-y-8 w-full max-w-xs">
          <input type="password" maxLength={6} value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••••" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-center text-4xl font-black text-red-500 focus:border-red-600 outline-none transition-all" autoFocus />
          <button type="submit" className="w-full py-4 bg-red-600 text-white font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center border-b border-white/5 pb-12 mb-12">
        <div className="flex items-center gap-6">
          <Box size={40} className="text-red-600" />
          <h1 className="text-4xl font-black italic uppercase text-white">Vault <span className="text-red-600">Command</span></h1>
        </div>
        <Link href="/intellitrade" className="px-8 py-4 bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-2xl flex items-center gap-3"><ArrowLeft size={16} /> Exit</Link>
      </header>
      <main className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem]"><p className="text-[9px] text-zinc-600 uppercase mb-2 font-bold">Pending Requests</p><p className="text-5xl font-black text-white italic">{pendingOrders.length}</p></div>
           <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem]"><p className="text-[9px] text-zinc-600 uppercase mb-2 font-bold">History (In/Out)</p><p className="text-5xl font-black text-white italic">{historyOrders.length}</p></div>
        </div>
        <section className="bg-zinc-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden">
           <nav className="flex border-b border-white/5 p-4 gap-4"><button onClick={() => setActiveTab('queue')} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Active Queue</button><button onClick={() => setActiveTab('history')} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Global History</button></nav>
           <div className="p-8">
              {activeTab === 'queue' ? (
                <div className="space-y-4">
                  {pendingOrders.map((p, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-8 border border-white/5 bg-black/40 items-center rounded-3xl gap-6">
                       <div className="md:col-span-4 flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Target Wallet</span><span className="text-xs font-bold text-zinc-400 truncate">{p.targetAddress}</span></div>
                       <div className="md:col-span-3 flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Resource / Qty</span><span className="text-sm font-black text-white uppercase italic">{p.amount} {p.asset}</span></div>
                       <div className="md:col-span-2">{p.paymentHash && <a href={`${CHAINS[p.chainId]?.explorer}${p.paymentHash}`} target="_blank" className="text-[9px] font-black text-blue-500 hover:text-white underline">VIEW PAYMENT</a>}</div>
                       <div className="md:col-span-3"><button onClick={() => approveOrder(p)} disabled={isProcessing} className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-white hover:text-black transition-all disabled:opacity-50">{isProcessing ? "Processing..." : "Authorize Release"}</button></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {historyOrders.map((t, i) => (
                    <div key={i} className={`flex justify-between items-center p-6 border border-white/5 bg-black/20 rounded-2xl`}>
                       <div className="flex gap-10 items-center">
                          <div className="flex items-center gap-4">{t.side === 'buy' ? <ArrowDownLeft className="text-blue-500" size={20} /> : <ArrowUpRight className="text-emerald-500" size={20} />}<div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">OP</span><span className={`text-[10px] font-black uppercase ${t.side === 'buy' ? 'text-blue-500' : 'text-emerald-400'}`}>{t.side.toUpperCase()}</span></div></div>
                          <div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Amount</span><span className="text-xs font-black text-white">{t.amount} {t.asset}</span></div>
                          <div className="flex flex-col"><span className="text-[8px] text-zinc-600 uppercase">Time</span><span className="text-[10px] font-bold text-zinc-500">{new Date(t.createdAt).toLocaleString()}</span></div>
                       </div>
                       <div className="flex gap-3">
                          {t.paymentHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.paymentHash}`} target="_blank" className="p-3 bg-zinc-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><LinkIcon size={12} /></a>}
                          {t.txHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.txHash}`} target="_blank" className="p-3 bg-zinc-900 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><ExternalLink size={12} /></a>}
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </section>
      </main>
    </div>
  );
};

export default VaultControlPanel;
