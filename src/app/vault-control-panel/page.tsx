"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ExternalLink, ListFilter, Terminal
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const ADMIN_PIN = "2026"; // Default PIN

  const isAdmin = useMemo(() => account?.toLowerCase() === DEALER_WALLET.toLowerCase(), [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accs: string[]) => {
        if (accs.length > 0) setAccount(accs[0]);
      });
      window.ethereum.on('accountsChanged', (accs: any) => {
          setAccount(accs[0] || null);
          setIsUnlocked(false); // Relock on account change
      });
    }

    const savedPending = localStorage.getItem('pending_orders');
    if (savedPending) setPendingOrders(JSON.parse(savedPending));
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsUnlocked(true);
      toast.success("Security Clearance Granted");
    } else {
      toast.error("INVALID PIN: ACCESS DENIED");
      setPinInput("");
    }
  };

  const approveOrder = async (order: any) => {
    if (!isAdmin || !isUnlocked) return toast.error("ACCESS DENIED: Unauthorized Entity");
    setIsProcessing(true);
    const tId = toast.loading(`Approving Release for ${order.id}...`);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const cid = Number(network.chainId);
      const isNative = order.asset === 'BNB' || order.asset === 'POL';

      let tx;
      if (isNative) {
        tx = await signer.sendTransaction({ to: order.targetAddress, value: ethers.parseEther(order.amount.toString()) });
      } else {
        const config = CHAINS[cid];
        if (!config) throw new Error("Switch to BSC or Polygon in MetaMask");
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), 18));
      }
      
      await tx.wait();
      
      const updatedPending = pendingOrders.filter(p => p.id !== order.id);
      setPendingOrders(updatedPending);
      localStorage.setItem('pending_orders', JSON.stringify(updatedPending));

      const savedHistory = localStorage.getItem('trade_history');
      const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
      const newTrade = {
        id: tx.hash.slice(0,12),
        fullHash: tx.hash,
        date: new Date().toLocaleString(),
        asset: order.asset,
        side: 'buy',
        amount: order.amount,
        total: (parseFloat(order.amount) * order.price).toLocaleString('id-ID'),
        chain: CHAINS[cid]?.name || 'Unknown',
        status: 'approved',
        owner: order.targetAddress.toLowerCase()
      };
      localStorage.setItem('trade_history', JSON.stringify([newTrade, ...currentHistory]));
      
      toast.success("Liquidity Released Successfully", { id: tId });
    } catch (err: any) {
      toast.error(err.message || "Execution Failed", { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#010102] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-zinc-900/50 border border-white/5 p-12 rounded-[3rem] text-center space-y-8 shadow-2xl">
          <ShieldCheck className="mx-auto text-blue-500" size={64} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Security Protocol Active</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">Connect Institutional Wallet to access the Vault Control Panel.</p>
          <button 
            onClick={() => window.ethereum?.request({ method: 'eth_requestAccounts' })}
            className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all"
          >
            Connect Admin Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#010102] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 p-12 rounded-[3rem] text-center space-y-8">
          <Terminal className="mx-auto text-red-500" size={64} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-red-500">Access Restricted</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">Account {account.slice(0,10)}... is not authorized for Vault operations.</p>
          <Link href="/intellitrade" className="block text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-all">Back to Terminal</Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#010102] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 p-12 rounded-[3rem] text-center space-y-8 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
          <ShieldCheck className="mx-auto text-red-500" size={64} />
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Identity Verification</h1>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest leading-relaxed">Enter Administrative Secure PIN to Unlock Control Panel</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <input 
              type="password" 
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full bg-black border border-white/10 p-6 rounded-2xl text-center text-3xl font-black tracking-[0.5em] text-red-500 focus:border-red-600 outline-none transition-all"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
            >
              Verify Authority
            </button>
          </form>
          <Link href="/intellitrade" className="block text-[8px] font-black uppercase text-zinc-600 hover:text-white transition-all">Cancel Authorization</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 font-sans p-4 md:p-8 lg:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-white/5 pb-10 mb-12">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">VAULT CONTROL <span className="text-red-500">PANEL</span></h1>
            <p className="text-[8px] tracking-[1em] text-zinc-600 uppercase">Authorization Node: {account.slice(0,8)}...</p>
          </div>
        </div>
        <Link href="/intellitrade" className="flex items-center gap-3 px-6 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-xl">
          <ArrowLeft size={14} /> Back to Terminal
        </Link>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-12">
           <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem]">
              <p className="text-[8px] text-zinc-600 uppercase mb-2 tracking-widest">Pending Requests</p>
              <p className="text-4xl font-black text-white">{pendingOrders.length}</p>
           </div>
           <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem]">
              <p className="text-[8px] text-zinc-600 uppercase mb-2 tracking-widest">System Status</p>
              <p className="text-xl font-black text-emerald-500 uppercase italic">Operational</p>
           </div>
        </div>

        <section className="bg-black border border-red-500/20 p-12 rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.05)]">
           <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
              <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Order Queue</h2>
              <ListFilter size={18} className="text-zinc-700" />
           </div>

           <div className="space-y-6 font-mono">
              {pendingOrders.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-zinc-600 uppercase text-[10px] tracking-[0.5em]">No pending transactions detected</p>
                </div>
              ) : (
                pendingOrders.map((p, i) => (
                  <div key={i} className="grid grid-cols-12 p-8 border border-white/5 bg-zinc-900/10 items-center rounded-[2.5rem] gap-8 hover:bg-zinc-900/30 transition-all group">
                     <div className="col-span-2">
                        <span className="text-[8px] text-zinc-600 uppercase block mb-1">ID</span>
                        <span className="text-xs font-bold text-blue-500">{p.id}</span>
                     </div>
                     <div className="col-span-4">
                        <span className="text-[8px] text-zinc-600 uppercase block mb-1">Target Address</span>
                        <span className="text-[10px] font-bold text-zinc-400 truncate block">{p.targetAddress}</span>
                     </div>
                     <div className="col-span-2">
                        <span className="text-[8px] text-zinc-600 uppercase block mb-1">Asset</span>
                        <span className="text-xs font-black text-white uppercase">{p.amount} {p.asset}</span>
                     </div>
                     <div className="col-span-2 text-right">
                        <span className="text-[8px] text-zinc-600 uppercase block mb-1">Est. Value</span>
                        <span className="text-xs font-bold text-zinc-500">Rp { (parseFloat(p.amount) * p.price).toLocaleString('id-ID') }</span>
                     </div>
                     <div className="col-span-2 text-right">
                        <button 
                          onClick={() => approveOrder(p)}
                          disabled={isProcessing}
                          className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                        >
                          {isProcessing ? <RefreshCw className="animate-spin mx-auto" size={14} /> : "Authorize"}
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-zinc-800 uppercase tracking-[0.5em]">
         <span>Vault Protocol v.6.5 SECURED</span>
         <span>© BLACK INTELLISENSE INSTITUTIONAL</span>
      </footer>
    </div>
  );
};

export default VaultControlPanel;
