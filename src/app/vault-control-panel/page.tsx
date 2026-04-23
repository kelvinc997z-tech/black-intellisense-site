"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShieldCheck, RefreshCw, ArrowLeft, ListFilter, Terminal
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

  const ADMIN_PIN = "872139"; 

  const isAdmin = useMemo(() => account?.toLowerCase() === DEALER_WALLET.toLowerCase(), [account]);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setPendingOrders(data.filter((o: any) => o.status === 'pending'));
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accs: string[]) => {
        if (accs.length > 0) setAccount(accs[0]);
      });
      window.ethereum.on('accountsChanged', (accs: any) => {
          setAccount(accs[0] || null);
          setIsUnlocked(false);
      });
    }
    fetchPending();
    const interval = setInterval(fetchPending, 5000);
    return () => clearInterval(interval);
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
    if (!isAdmin || !isUnlocked) return toast.error("ACCESS DENIED");
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
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount.toString(), 18));
      }
      
      await tx.wait();
      
      // Update Database
      await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id: order.id,
              status: 'approved',
              txHash: tx.hash
          })
      });

      toast.success("Liquidity Released Successfully", { id: tId });
      fetchPending();
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
          <button onClick={() => window.ethereum?.request({ method: 'eth_requestAccounts' })} className="w-full py-4 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all">Connect Admin Wallet</button>
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
          <Link href="/intellitrade" className="block text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-all">Back to Terminal</Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#010102] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 p-12 rounded-[3rem] text-center space-y-8">
          <ShieldCheck className="mx-auto text-red-500" size={64} />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Identity Verification</h1>
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <input type="password" maxLength={6} value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-center text-3xl font-black tracking-[0.5em] text-red-500 focus:border-red-600 outline-none transition-all" autoFocus />
            <button type="submit" className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">Verify Authority</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 font-sans p-4 md:p-8 lg:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-center border-b border-white/5 pb-10 mb-12">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]"><ShieldCheck size={32} className="text-white" /></div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">VAULT CONTROL <span className="text-red-500">PANEL</span></h1>
            <p className="text-[8px] tracking-[1em] text-zinc-600 uppercase">Authorization Node: {account.slice(0,8)}...</p>
          </div>
        </div>
        <Link href="/intellitrade" className="flex items-center gap-3 px-6 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-xl"><ArrowLeft size={14} /> Back to Terminal</Link>
      </header>

      <main className="max-w-7xl mx-auto">
        <section className="bg-black border border-red-500/20 p-12 rounded-[3rem]">
           <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5"><h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Order Queue</h2></div>
           <div className="space-y-6 font-mono">
              {pendingOrders.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]"><p className="text-zinc-600 uppercase text-[10px] tracking-[0.5em]">No pending transactions</p></div>
              ) : (
                pendingOrders.map((p, i) => (
                  <div key={i} className="grid grid-cols-12 p-8 border border-white/5 bg-zinc-900/10 items-center rounded-[2.5rem] gap-8 hover:bg-zinc-900/30 transition-all">
                     <div className="col-span-2"><span className="text-[8px] text-zinc-600 uppercase block mb-1">ID</span><span className="text-xs font-bold text-blue-500">{p.id.slice(0,8)}</span></div>
                     <div className="col-span-4"><span className="text-[8px] text-zinc-600 uppercase block mb-1">Target</span><span className="text-[10px] font-bold text-zinc-400 truncate block">{p.targetAddress}</span></div>
                     <div className="col-span-2"><span className="text-[8px] text-zinc-600 uppercase block mb-1">Asset</span><span className="text-xs font-black text-white uppercase">{p.amount} {p.asset}</span></div>
                     <div className="col-span-2 text-right"><span className="text-[8px] text-zinc-600 uppercase block mb-1">Value</span><span className="text-xs font-bold text-zinc-500">Rp { (parseFloat(p.amount) * p.price).toLocaleString('id-ID') }</span></div>
                     <div className="col-span-2 text-right"><button onClick={() => approveOrder(p)} disabled={isProcessing} className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">Authorize</button></div>
                  </div>
                ))
              )}
           </div>
        </section>
      </main>
    </div>
  );
};

export default VaultControlPanel;
