"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  Activity, Cpu, Terminal, Radio, Database, BarChart3, ScanFace, 
  FileDown, LayoutGrid, ListFilter, ExternalLink, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DEALER_WALLET = "0xE0BE7181C05023999c1e15b5a1Eb89147DcEB334";
const CHAINS: Record<number, { name: string; usdt: string; explorer: string }> = {
  56: { name: 'BSC', usdt: '0x55d398326f99059fF775485246999027B3197955', explorer: 'https://bscscan.com/tx/' },
  137: { name: 'Polygon', usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', explorer: 'https://polygonscan.com/tx/' }
};
const ASSETS = [
  { id: 'USDT', name: 'Tether USD', icon: '₮', color: 'text-emerald-500' },
  { id: 'BNB', name: 'Binance Coin', icon: 'B', color: 'text-yellow-500' },
  { id: 'USDC', name: 'USD Coin', icon: 'S', color: 'text-blue-500' },
  { id: 'PAXG', name: 'PAX Gold', icon: 'G', color: 'text-amber-500' },
];

const IntelliTradeV6 = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAsset, setActiveAsset] = useState(ASSETS[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<'terminal' | 'reports'>('terminal');
  const [blocks, setBlocks] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({ side: 'buy', amount: '' });

  const currentPrice = useMemo(() => {
    let base = rateIDR;
    if (activeAsset.id === 'PAXG') base = rateIDR * 140;
    if (activeAsset.id === 'BNB') base = rateIDR * 600;
    return orderForm.side === 'buy' ? base + 10.5 : base - 10.5;
  }, [activeAsset.id, rateIDR, orderForm.side]);

  const vaultLiquidity = useMemo(() => (1250450.75).toLocaleString(), []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) {}
    };
    fetchRate();
    const interval = setInterval(() => {
      const hash = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
      setBlocks(prev => [hash, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return toast.error("Install MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err) {}
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("Connect Wallet First");
    if (!orderForm.amount) return toast.error("Input Amount");

    setIsProcessing(true);
    const tId = toast.loading("Confirming on MetaMask...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const cid = Number(network.chainId);

      let tx;
      const isNative = activeAsset.id === 'BNB' || activeAsset.id === 'POL';
      
      if (isNative) {
        tx = await signer.sendTransaction({
          to: DEALER_WALLET,
          value: ethers.parseEther(orderForm.amount)
        });
      } else {
        const config = CHAINS[cid];
        if (!config) throw new Error("Switch to BSC or Polygon");
        
        const contract = new ethers.Contract(config.usdt, [
          "function transfer(address to, uint256 amount) public returns (bool)",
          "function decimals() view returns (uint8)"
        ], signer);
        
        let decimals = 18;
        try {
          decimals = await contract.decimals();
        } catch (e) {
          // Fallback to known decimals if decimals() call fails
          decimals = cid === 137 ? 6 : 18;
        }
        
        tx = await contract.transfer(DEALER_WALLET, ethers.parseUnits(orderForm.amount, decimals));
      }

      toast.loading("Processing Blockchain Confirmation...", { id: tId });
      const receipt = await tx.wait();
      
      const newTrade = {
        id: receipt.hash.slice(0,12),
        fullHash: receipt.hash,
        date: new Date().toLocaleString(),
        asset: activeAsset.id,
        side: orderForm.side,
        amount: orderForm.amount,
        total: (parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID'),
        chain: cid === 56 ? 'BSC' : 'Polygon'
      };

      setHistory([newTrade, ...history]);
      toast.success("Transaction Successful", { id: tId });
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err: any) {
      toast.error(err.reason || err.message || "Failed", { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Trade Audit Logs', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Ticket', 'Time', 'Asset', 'Side', 'Qty', 'Total']],
      body: history.map(t => [t.id, t.date, t.asset, t.side, t.amount, t.total]),
    });
    doc.save('Report.pdf');
  };

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 font-sans overflow-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(29,78,216,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 lg:p-12 space-y-8 overflow-hidden">
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-10 gap-8">
          <div className="flex items-center gap-6">
            <img src="/logo.jpg" alt="Logo" className="w-16 h-16 object-contain rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)]" />
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase font-heading">INTELLITRADE <span className="text-blue-500">V.6-PRO</span></h1>
              <p className="text-[8px] tracking-[1em] text-zinc-600 uppercase">Institutional Nexus</p>
            </div>
          </div>
          <nav className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <button onClick={() => setView('terminal')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'terminal' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>Terminal</button>
            <button onClick={() => setView('reports')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>Reports</button>
          </nav>
          <button onClick={connectWallet} className="px-8 py-3 bg-zinc-900 border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">
            {account ? `KYB: ${account.slice(0,8)}...` : "VERIFY ENTITY"}
          </button>
        </header>

        {view === 'terminal' ? (
          <main className="flex-1 grid lg:grid-cols-12 gap-12 overflow-hidden">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex-1 bg-black border border-white/5 p-12 flex flex-col justify-between relative group rounded-[3rem]">
                <div className="flex justify-between items-start">
                   <div className="flex flex-wrap gap-4">
                    {ASSETS.map(a => (
                      <button key={a.id} onClick={() => setActiveAsset(a)} className={`px-5 py-2.5 border rounded-xl text-[10px] font-black tracking-widest transition-all ${activeAsset.id === a.id ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 text-zinc-600'}`}>{a.id} / IDR</button>
                    ))}
                   </div>
                   <div className="text-right font-mono">
                      <p className="text-[10px] text-zinc-600 uppercase mb-1">Vault Liquidity</p>
                      <p className="text-lg font-black text-zinc-300 font-mono tracking-tighter font-mono">${vaultLiquidity}</p>
                   </div>
                </div>
                <div className="flex items-baseline gap-8 my-12">
                   <h2 className="text-[14vw] lg:text-[10vw] font-black italic tracking-tighter text-white leading-[0.8] font-heading font-heading">{currentPrice.toLocaleString('id-ID')}</h2>
                   <span className="text-5xl font-black text-zinc-800 uppercase font-heading">IDR</span>
                </div>
                <div className="grid grid-cols-4 gap-8 pt-10 border-t border-white/5">
                   {[{ l: "Spread", v: "0.04%" }, { l: "Volatility", v: "High" }, { l: "Ping", v: "0.42ms" }, { l: "Router", v: "v6-PRO" }].map((m, i) => (
                    <div key={i}><p className="text-[9px] text-zinc-600 uppercase mb-1 tracking-widest">{m.l}</p><p className="text-sm font-black text-white">{m.v}</p></div>
                   ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 h-48 font-mono font-mono">
                 <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2rem] flex flex-col gap-3 font-mono">
                    <span className="text-[10px] font-black text-red-500/50 uppercase tracking-widest">Sell Depth</span>
                    {[1, 2, 3].map(i => <div key={i} className="flex justify-between text-xs opacity-30 font-mono"><span>{(currentPrice + i * 10).toLocaleString()}</span><span>{Math.floor(Math.random() * 5000)}</span></div>)}
                 </div>
                 <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2rem] flex flex-col gap-3 font-mono">
                    <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Buy Depth</span>
                    {[1, 2, 3].map(i => <div key={i} className="flex justify-between text-xs opacity-30 font-mono"><span>{(currentPrice - i * 10).toLocaleString()}</span><span>{Math.floor(Math.random() * 5000)}</span></div>)}
                 </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8 font-mono">
               <div className="flex-1 bg-[#050505] border border-white/10 p-10 flex flex-col rounded-[3rem] shadow-2xl relative">
                  <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl mb-12 font-sans">
                    <button onClick={() => setOrderForm({...orderForm, side: 'buy'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'buy' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>BUY</button>
                    <button onClick={() => setOrderForm({...orderForm, side: 'sell'})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'sell' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>SELL</button>
                  </div>
                  <form onSubmit={handleExecute} className="flex-1 flex flex-col justify-between font-mono">
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <label className="text-[10px] text-zinc-600 uppercase tracking-widest ml-4 font-sans">Execution Amount</label>
                          <div className="relative">
                             <input type="number" step="any" value={orderForm.amount} onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})} placeholder="0.00" className="w-full bg-black border border-white/10 p-8 rounded-3xl text-4xl font-black text-white outline-none focus:border-blue-600 font-mono font-mono" />
                             <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black italic text-zinc-700 text-xl">{activeAsset.id}</span>
                          </div>
                       </div>
                       {orderForm.amount && (
                         <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2rem] space-y-6 font-mono">
                            <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-sans"><span>Locked Rate</span><span className="font-mono font-mono">Rp {currentPrice.toLocaleString('id-ID')}</span></div>
                            <div className="flex flex-col pt-4 border-t border-white/5"><span className="text-[10px] font-black text-blue-400 uppercase mb-2 font-sans">Aggregate Value</span><span className="text-4xl font-black text-white italic font-heading font-heading">Rp {(parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')}</span></div>
                         </div>
                       )}
                    </div>
                    <button type="submit" disabled={isProcessing} className={`w-full py-10 rounded-[2.5rem] text-xl font-black tracking-widest uppercase transition-all flex items-center justify-center gap-6 font-sans ${isProcessing ? 'bg-zinc-900 text-zinc-700' : 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-2xl'}`}>
                       {isProcessing ? <RefreshCw className="animate-spin" size={32} /> : <>CONFIRM {orderForm.side.toUpperCase()}</>}
                    </button>
                  </form>
               </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 bg-black border border-white/5 p-12 overflow-y-auto rounded-[3rem]">
             <div className="flex justify-between items-end mb-12 pb-8 border-b border-white/5">
                <div><h2 className="text-4xl font-black italic uppercase text-white font-heading font-heading">Audit Logs</h2><p className="text-[10px] tracking-widest text-zinc-600 uppercase mt-2 font-sans">Institutional Ledger History</p></div>
                <button onClick={exportPDF} className={`flex items-center gap-3 px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full font-sans`}><FileDown size={18} /> Export PDF</button>
             </div>
             <div className="space-y-6 font-mono font-mono">
                {history.map((t, i) => (
                  <div key={i} className="grid grid-cols-6 p-8 border border-white/5 bg-zinc-900/10 hover:bg-zinc-900/20 transition-all items-center rounded-3xl font-mono">
                     <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Ticket</span><span className="text-sm font-bold text-blue-500 font-mono">{t.id}</span></div>
                     <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Time</span><span className="text-sm font-bold font-mono">{t.date}</span></div>
                     <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Asset</span><span className="text-sm font-bold text-white font-heading font-heading">{t.asset}</span></div>
                     <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Op</span><span className={`text-sm font-bold uppercase ${t.side === 'buy' ? 'text-emerald-400' : 'text-red-400'} font-sans`}>{t.side}</span></div>
                     <div className="flex flex-col text-right"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Qty</span><span className="text-sm font-bold text-white font-mono">{t.amount}</span></div>
                     <div className="flex flex-col text-right"><a href={t.chain === 'BSC' ? `https://bscscan.com/tx/${t.fullHash}` : `https://polygonscan.com/tx/${t.fullHash}`} target="_blank" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-all underline decoration-blue-500/20 underline-offset-4 font-sans">Explorer</a></div>
                  </div>
                ))}
             </div>
          </main>
        )}
        <footer className="h-10 border-t border-white/5 flex items-center justify-between text-[8px] font-bold text-zinc-800 uppercase tracking-[0.5em] font-mono font-mono">
           <div className="flex gap-10"><span>Secure Protocol V.6.5</span><span>Handshake Verified</span></div>
           <div className="flex items-center gap-6">{blocks.slice(0,2).map((b, i) => <span key={i} className="text-zinc-900 font-mono">BLOCK: {b}</span>)}</div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Space+Grotesk:wght@700;900&family=JetBrains+Mono:wght@500;800&display=swap');
        :root { --font-sans: 'Inter', sans-serif; --font-heading: 'Space Grotesk', sans-serif; --font-mono: 'JetBrains Mono', monospace; }
        body { font-family: var(--font-sans); background-color: #010102; color-scheme: dark; }
        .font-heading { font-family: var(--font-heading); font-weight: 900; }
        .font-mono { font-family: var(--font-mono); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; }
      `}</style>
    </div>
  );
};

export default IntelliTradeV6;
