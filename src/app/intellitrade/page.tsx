"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  ShieldAlert, Lock, Fingerprint, Activity, Cpu, Globe, 
  Key, RefreshCw, Layers, Server, Terminal, Radio, 
  Database, BarChart3, ScanFace, FileDown, Eye, LayoutGrid, ListFilter
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CHAINS: Record<number, { name: string; usdt: string; symbol: string; color: string }> = {
  56: { name: 'BSC-MAINNET', usdt: '0x55d3...7955', symbol: 'BNB', color: 'text-yellow-400' },
  137: { name: 'POLYGON-POS', usdt: '0xc213...8e8f', symbol: 'POL', color: 'text-purple-400' }
};

const ASSETS = [
  { id: 'USDT', name: 'Tether USD', icon: '₮', color: 'text-emerald-500' },
  { id: 'USDC', name: 'USD Coin', icon: 'S', color: 'text-blue-500' },
  { id: 'PAXG', name: 'PAX Gold', icon: 'G', color: 'text-amber-500' },
];

const IntelliTradeV6 = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [neuralStatus, setNeuralStatus] = useState("SYNC_OK");
  const [blocks, setBlocks] = useState<string[]>([]);
  const [activeAsset, setActiveAsset] = useState(ASSETS[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<'terminal' | 'reports'>('terminal');
  
  const [orderForm, setOrderForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    amount: '',
  });

  const currentPrice = useMemo(() => {
    const base = activeAsset.id === 'PAXG' ? rateIDR * 140 : rateIDR;
    return orderForm.side === 'buy' ? base + 10.5 : base - 10.5;
  }, [orderForm.side, rateIDR, activeAsset]);

  // Proof of Reserve Simulation
  const vaultLiquidity = useMemo(() => (1250450.75 + Math.random() * 1000).toLocaleString(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      const hash = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
      setBlocks(prev => [hash, ...prev].slice(0, 5));
    }, 4000);
    
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) { console.error(err); }
    };
    fetchRate();
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("NEURAL_LINK_FAILED");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("KYB_VERIFIED", { icon: <ScanFace /> });
    } catch (err) { toast.error("HANDSHAKE_REJECTED"); }
  };

  const handleV6Execution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("SYSTEM_LOCKED");
    
    setIsProcessing(true);
    const toastId = toast.loading("EXECUTING MULTI-CHAIN SMART ROUTING...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const sequence = ["VALIDATING_DOMAIN", "SCANNING_DEX_LIQUIDITY", "OPTIMIZING_GAS_FEE", "SIGNING_PAYLOAD"];
      for (const step of sequence) {
        toast.loading(step, { id: toastId });
        await new Promise(r => setTimeout(r, 800));
      }

      const v6Msg = `[BLACKINTELLISENSE PRO V6]\n` +
                    `---------------------------\n` +
                    `OP: OTC_SETTLEMENT\n` +
                    `ASSET: ${activeAsset.id}\n` +
                    `QTY: ${orderForm.amount}\n` +
                    `RATE: ${currentPrice}\n` +
                    `ROUTING: ${chainId === 56 ? 'PancakeSwap-V3' : 'QuickSwap-V3'}\n` +
                    `---------------------------\n` +
                    `SIGN TO FINALIZE`;

      await signer.signMessage(v6Msg);
      
      const newTrade = {
        id: ethers.keccak256(ethers.toUtf8Bytes(Date.now().toString())).slice(0,12),
        date: new Date().toLocaleString(),
        asset: activeAsset.id,
        side: orderForm.side,
        amount: orderForm.amount,
        total: (parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')
      };

      setHistory([newTrade, ...history]);
      toast.success("TRANSACTION_FINALIZED", { id: toastId, icon: <ShieldCheck className="text-emerald-500" /> });
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err) {
      toast.error("ABORTED", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 font-mono overflow-hidden flex flex-col">
      
      {/* V6 Cyber Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(29,78,216,0.1),transparent_40%)]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        
        {/* Institutional Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-blue-600 rounded-sm shadow-[0_0_30px_rgba(37,99,235,0.4)] animate-pulse">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[0.3em] text-white flex items-baseline gap-2">
                INTELLITRADE <span className="text-blue-500">V.6-PRO</span>
              </h1>
              <p className="text-[7px] text-zinc-600 tracking-[1em] font-bold uppercase mt-1">Institutional Liquidity Nexus</p>
            </div>
          </div>

          <nav className="flex items-center gap-4 bg-zinc-900/50 p-1 rounded-sm border border-white/5">
            <button onClick={() => setView('terminal')} className={`px-4 py-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${view === 'terminal' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <LayoutGrid size={12} /> Terminal
            </button>
            <button onClick={() => setView('reports')} className={`px-4 py-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <ListFilter size={12} /> Reports
            </button>
          </nav>

          <div className="flex items-center gap-6">
             <button onClick={connectWallet} className="px-6 py-2.5 bg-zinc-900 border border-white/10 text-[9px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all">
              {account ? `[ KYB: ${account.slice(0,8)} ]` : "VERIFY_ENTITY"}
             </button>
          </div>
        </header>

        {view === 'terminal' ? (
          <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
            
            {/* Left Col: Market Analytics */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
              
              {/* Massive Data Core */}
              <div className="flex-1 bg-black border border-white/5 p-10 flex flex-col relative group">
                <div className="flex justify-between items-start mb-12">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em]">MARKET_FEED_ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        {ASSETS.map(asset => (
                          <button 
                            key={asset.id} 
                            onClick={() => setActiveAsset(asset)}
                            className={`px-4 py-2 border rounded-sm text-[9px] font-black tracking-widest transition-all ${activeAsset.id === asset.id ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 text-zinc-600 hover:text-zinc-400'}`}
                          >
                            {asset.id} / IDR
                          </button>
                        ))}
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] text-zinc-600 tracking-widest uppercase mb-1">Vault Liquidity (PoR)</p>
                      <p className="text-sm font-black text-zinc-300 font-mono tracking-tighter">${vaultLiquidity} USDT</p>
                   </div>
                </div>

                <div className="flex-1 flex items-center">
                  <div className="flex items-baseline gap-6">
                    <h2 className="text-[14vw] lg:text-[12vw] font-black italic tracking-tighter text-white leading-none">
                      {currentPrice.toLocaleString('id-ID')}
                    </h2>
                    <span className="text-4xl font-black text-zinc-800 italic uppercase">IDR</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-8 pt-8 border-t border-white/5">
                   {[
                    { l: "Spread", v: "0.04%", c: "text-emerald-400" },
                    { l: "Volatility", v: "High", c: "text-orange-400" },
                    { l: "Ping", v: "0.42ms", c: "text-blue-400" },
                    { l: "Router", v: "Smart-v6", c: "text-zinc-400" }
                   ].map((m, i) => (
                    <div key={i}>
                      <p className="text-[8px] text-zinc-600 tracking-widest uppercase mb-1">{m.l}</p>
                      <p className={`text-xs font-bold ${m.c}`}>{m.v}</p>
                    </div>
                   ))}
                </div>
              </div>

              {/* Order Book Visualization */}
              <div className="h-48 grid grid-cols-2 gap-6">
                 <div className="bg-zinc-900/20 border border-white/5 p-6 flex flex-col gap-2 overflow-hidden">
                    <span className="text-[8px] font-black text-red-500/50 tracking-widest mb-2 uppercase">Sell Depth</span>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-bold opacity-40">
                         <span className="text-red-400">{(currentPrice + (i+1)*5).toLocaleString()}</span>
                         <span>{Math.floor(Math.random() * 50000)} USDT</span>
                      </div>
                    ))}
                 </div>
                 <div className="bg-zinc-900/20 border border-white/5 p-6 flex flex-col gap-2 overflow-hidden">
                    <span className="text-[8px] font-black text-emerald-500/50 tracking-widest mb-2 uppercase">Buy Depth</span>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between text-[9px] font-bold opacity-40">
                         <span className="text-emerald-400">{(currentPrice - (i+1)*5).toLocaleString()}</span>
                         <span>{Math.floor(Math.random() * 50000)} USDT</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right Col: Execution Terminal */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
               <div className="flex-1 bg-[#050505] border border-white/10 p-8 flex flex-col relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl"></div>
                  
                  <div className="mb-10">
                     <h3 className="text-sm font-black tracking-[0.4em] text-white flex items-center gap-3 uppercase">
                        <Cpu size={16} className="text-blue-500" /> Execution Core
                     </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-8 bg-zinc-900/30 p-1 rounded-sm">
                    <button onClick={() => setOrderForm({...orderForm, side: 'buy'})} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'buy' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>Load_Beli</button>
                    <button onClick={() => setOrderForm({...orderForm, side: 'sell'})} className={`py-3 text-[9px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'sell' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Load_Jual</button>
                  </div>

                  <form onSubmit={handleV6Execution} className="flex-1 flex flex-col">
                    <div className="space-y-6 flex-1">
                       <div className="space-y-2">
                          <label className="text-[8px] text-zinc-600 tracking-widest uppercase ml-2">Qty ({activeAsset.id})</label>
                          <input type="number" value={orderForm.amount} onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})} placeholder="0.00" className="w-full bg-black border border-white/10 p-5 text-2xl font-black text-white outline-none focus:border-blue-600 transition-all" />
                       </div>

                       {orderForm.amount && (
                         <div className="bg-blue-600/5 border border-blue-500/20 p-6 space-y-4 animate-in slide-in-from-right-4">
                            <div className="flex justify-between text-[8px] tracking-widest uppercase text-zinc-500">
                               <span>Rate_Locked</span>
                               <span>Rp {currentPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black text-blue-400 tracking-[0.3em] uppercase mb-1">Settlement_Value</span>
                               <span className="text-3xl font-black text-white italic tracking-tighter">Rp {(parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')}</span>
                            </div>
                         </div>
                       )}
                    </div>

                    <button disabled={!account || !orderForm.amount || isProcessing} className={`w-full py-8 text-xs font-black tracking-[0.8em] uppercase transition-all flex items-center justify-center gap-4 ${account && orderForm.amount && !isProcessing ? 'bg-white text-black hover:bg-blue-600 hover:text-white' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}>
                       {isProcessing ? <RefreshCw className="animate-spin" /> : <><Zap size={16}/> Execute_V6_Handshake</>}
                    </button>
                  </form>
               </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 bg-black border border-white/5 p-12 overflow-y-auto">
             <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/5">
                <div className="space-y-2">
                   <h2 className="text-2xl font-black italic tracking-widest uppercase text-white">Trade History & Reports</h2>
                   <p className="text-[9px] text-zinc-600 tracking-widest font-bold uppercase italic">Institutional Audit Logs • Real-time Data</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  <FileDown size={14} /> Export CSV/PDF
                </button>
             </div>
             
             <div className="space-y-4">
                {history.length > 0 ? history.map((trade, i) => (
                  <div key={i} className="grid grid-cols-6 p-6 border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all items-center">
                     <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Ticket_ID</span>
                        <span className="text-xs font-bold text-blue-500">{trade.id}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Timestamp</span>
                        <span className="text-xs font-bold">{trade.date}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Asset</span>
                        <span className="text-xs font-bold text-white">{trade.asset}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Operation</span>
                        <span className={`text-xs font-bold uppercase ${trade.side === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>{trade.side}</span>
                     </div>
                     <div className="flex flex-col text-right">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Qty</span>
                        <span className="text-xs font-bold text-zinc-300">{trade.amount}</span>
                     </div>
                     <div className="flex flex-col text-right">
                        <span className="text-[7px] text-zinc-600 uppercase mb-1">Total IDR</span>
                        <span className="text-sm font-black text-white italic tracking-tighter">Rp {trade.total}</span>
                     </div>
                  </div>
                )) : (
                  <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-sm">
                     <Database className="text-zinc-800 mb-4" size={48} />
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">No Audit Logs Found</p>
                  </div>
                )}
             </div>
          </main>
        )}

        {/* Dynamic Data Ribbon */}
        <footer className="h-10 border-t border-white/5 flex items-center justify-between text-[7px] font-bold text-zinc-800 uppercase tracking-[0.5em]">
           <div className="flex gap-10">
              <span className="text-blue-900">BlackIntellisense_Protocol: v6.0.4-PRO</span>
              <span>Buffer: AES-1024-GCM</span>
              <span>Connection: Node_Optimized</span>
           </div>
           <div className="flex items-center gap-4">
              {blocks.slice(0,3).map((b, i) => <span key={i} className="text-zinc-900 animate-pulse">LATEST_BLOCK: {b}</span>)}
           </div>
        </footer>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; }
        @keyframes subtle-pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
        .cyber-grid { animation: subtle-pulse 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default IntelliTradeV6;
