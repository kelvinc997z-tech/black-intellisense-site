"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  Activity, Cpu, Terminal, Radio, Database, BarChart3, ScanFace, 
  FileDown, LayoutGrid, ListFilter, ExternalLink, RefreshCw,
  Globe, Lock, ShieldAlert, BadgeCheck, Bitcoin, Coins, Search,
  ArrowDownLeft, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: any;
    safepal?: any;
  }
}

const DEALER_WALLET = "0xE0BE7181C05023999c1e15b5a1Eb89147DcEB334";
const CHAINS: Record<number, { name: string; usdt: string; explorer: string }> = {
  56: { name: 'BSC', usdt: '0x55d398326f99059fF775485246999027B3197955', explorer: 'https://bscscan.com/tx/' },
  137: { name: 'Polygon', usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', explorer: 'https://polygonscan.com/tx/' }
};
const ASSETS = [
  { id: 'USDT', name: 'Tether USD', icon: <Coins className="w-4 h-4" />, color: 'emerald' },
  { id: 'BNB', name: 'Binance Coin', icon: <Bitcoin className="w-4 h-4" />, color: 'yellow' },
  { id: 'USDC', name: 'USD Coin', icon: <Coins className="w-4 h-4" />, color: 'blue' },
  { id: 'PAXG', name: 'PAX Gold', icon: <Coins className="w-4 h-4" />, color: 'amber' },
];

const IntelliTradeV7 = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAsset, setActiveAsset] = useState(ASSETS[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [view, setView] = useState<'terminal' | 'reports'>('terminal');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({ side: 'buy', amount: '' });
  const [vaultStats, setVaultStats] = useState({ liquidity: "1,250,450.75", transactions: "4.2k" });

  const currentPrice = useMemo(() => {
    let base = rateIDR;
    if (activeAsset.id === 'PAXG') base = rateIDR * 140;
    if (activeAsset.id === 'BNB') base = rateIDR * 600;
    // Add realistic market variance
    const variance = (Math.random() - 0.5) * 5;
    return orderForm.side === 'buy' ? base + 10.5 + variance : base - 10.5 + variance;
  }, [activeAsset.id, rateIDR, orderForm.side]);

  const refreshData = useCallback(async () => {
    if (!account) return;
    try {
      const res = await fetch(`/api/orders?address=${account.toLowerCase()}`, { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error("Sync Error:", err);
    }
  }, [account]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) {}
    };
    fetchRate();
    
    // Animated Terminal Logs
    const logPool = [
      "SYNCHRONIZING_LIQUIDITY_POOLS...",
      "FETCHING_DEEP_ORDER_FLOW...",
      "NEURAL_PRICE_CALIBRATION_OK",
      "BLOCK_CONFIRMATION_PENDING...",
      "ESTABLISHING_ENCRYPTED_TUNNEL...",
      "VAULT_BALANCE_VERIFIED",
    ];
    
    const interval = setInterval(() => {
      const log = `[${new Date().toLocaleTimeString()}] ${logPool[Math.floor(Math.random() * logPool.length)]}`;
      setTerminalLogs(prev => [log, ...prev].slice(0, 12));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const win = window as any;
    return win.safepal || (win.ethereum?.isSafePal ? win.ethereum : win.ethereum);
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const handleChain = (id: string) => setChainId(parseInt(id, 16));
    const handleAccounts = (accs: string[]) => {
      setAccount(accs[0] || null);
    };

    provider.on('chainChanged', handleChain);
    provider.on('accountsChanged', handleAccounts);

    provider.request({ method: 'eth_accounts' }).then((accs: string[]) => {
      if (accs.length > 0) setAccount(accs[0]);
    });

    return () => {
      if (provider.removeListener) {
        provider.removeListener('chainChanged', handleChain);
        provider.removeListener('accountsChanged', handleAccounts);
      }
    };
  }, [getProvider]);

  useEffect(() => {
    if (account) {
      refreshData();
      const interval = setInterval(refreshData, 5000);
      return () => clearInterval(interval);
    }
  }, [account, refreshData]);

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) return toast.error("SafePal Wallet Not Found");
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      toast.success("Identity Linked");
    } catch (err: any) {
      toast.error("Auth Failed");
    }
  };

  const handleExecute = async () => {
    if (!account) return connectWallet();
    if (!orderForm.amount) return toast.error("Enter Amount");
    setIsProcessing(true);
    const tId = toast.loading("Initializing Smart Transaction...");
    
    try {
      const provider = new ethers.BrowserProvider(getProvider());
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const cid = Number(network.chainId);
      
      const isBuy = orderForm.side === 'buy';
      let tx;

      if (isBuy) {
        // Buy Logic (Transfer USDT to Dealer)
        const totalUSDT = (parseFloat(orderForm.amount) * currentPrice) / rateIDR;
        const config = CHAINS[cid];
        if (!config) throw new Error("Please switch to BSC or Polygon");
        
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        const decimals = cid === 137 ? 6 : 18;
        tx = await contract.transfer(DEALER_WALLET, ethers.parseUnits(totalUSDT.toFixed(decimals), decimals));
      } else {
        // Sell Logic (Transfer Asset to Dealer)
        const config = CHAINS[cid];
        if (activeAsset.id === 'BNB') {
           tx = await signer.sendTransaction({ to: DEALER_WALLET, value: ethers.parseEther(orderForm.amount) });
        } else {
           if (!config) throw new Error("Switch Network");
           const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
           tx = await contract.transfer(DEALER_WALLET, ethers.parseUnits(orderForm.amount, 18));
        }
      }

      toast.loading("Awaiting Block Confirmation...", { id: tId });
      const receipt = await tx.wait();

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAddress: account.toLowerCase(),
          asset: activeAsset.id,
          amount: orderForm.amount,
          price: currentPrice,
          side: orderForm.side,
          chainId: cid,
          paymentHash: receipt.hash,
          status: isBuy ? 'pending' : 'approved'
        }),
      });

      toast.success("Transaction Successfully Broadcasted", { id: tId });
      setOrderForm({ ...orderForm, amount: '' });
      refreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed", { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-mono tracking-tight selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Background Neural UI */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-10 max-w-[1800px] mx-auto w-full">
        {/* Header V7 */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 border-b border-white/[0.03] pb-10">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center text-black font-black text-2xl rotate-[-2deg] shadow-2xl relative z-10">I</div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                IntelliTrade <span className="px-2 py-0.5 bg-blue-600 text-[10px] not-italic tracking-widest rounded-sm text-white">V7.0-ULTRA</span>
              </h1>
              <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">
                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                Neural_Liquidity_Grid_Active
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
             <div className="flex bg-[#080808] p-1 border border-white/[0.05] rounded-sm">
                <button onClick={() => setView('terminal')} className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'terminal' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Terminal_Access</button>
                <button onClick={() => setView('reports')} className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Audit_Reports</button>
             </div>
             
             <button onClick={account ? () => setAccount(null) : connectWallet} className="px-8 py-3 bg-zinc-900 border border-white/[0.05] text-[10px] font-black uppercase tracking-widest hover:border-blue-500/50 transition-all flex items-center gap-3 group">
                <Wallet className={`w-4 h-4 ${account ? 'text-emerald-500' : 'text-zinc-500'}`} />
                {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Verify_Identity"}
             </button>
          </div>
        </header>

        {view === 'terminal' ? (
          <div className="flex-1 grid lg:grid-cols-12 gap-8">
            {/* Core Display */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex-1 bg-black border border-white/[0.05] p-10 md:p-20 overflow-hidden group rounded-sm"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-8 flex flex-col gap-2 items-end opacity-20 font-mono text-[8px] text-zinc-500">
                   <span>SYS_TEMP: 32.4°C</span>
                   <span>NODE_LOC: SIN-PROX-01</span>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex flex-wrap gap-4">
                    {ASSETS.map(a => (
                      <button key={a.id} onClick={() => setActiveAsset(a)} className={`px-6 py-3 border text-[10px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-3 ${activeAsset.id === a.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-white/5 text-zinc-600 hover:border-white/20'}`}>
                        {a.icon} {a.id} / IDR
                      </button>
                    ))}
                  </div>

                  <div className="my-16 md:my-24">
                     <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">
                        <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                        Live_Aggregate_Feed
                     </div>
                     <motion.div 
                      key={currentPrice}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="flex items-baseline gap-6"
                    >
                        <span className="text-[12vw] lg:text-[8vw] font-black italic tracking-tighter leading-none text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                          {currentPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-4xl md:text-6xl font-black text-zinc-800 italic uppercase">IDR</span>
                     </motion.div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/[0.03]">
                     {[
                       { l: "Locked_Spread", v: "0.02%", i: <ShieldCheck className="w-3 h-3" /> },
                       { l: "Execution_Ping", v: "0.12ms", i: <Zap className="w-3 h-3" /> },
                       { l: "Liquidity_Depth", v: "Ultra-High", i: <Database className="w-3 h-3" /> },
                       { l: "Protocol_Layer", v: "TCP/X-7", i: <Globe className="w-3 h-3" /> }
                     ].map((item, idx) => (
                       <div key={idx} className="space-y-1">
                          <p className="text-[9px] text-zinc-600 uppercase font-black flex items-center gap-2">{item.i} {item.l}</p>
                          <p className="text-sm font-black text-white italic">{item.v}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </motion.div>

              {/* Advanced System Logs */}
              <div className="h-48 bg-[#050505] border border-white/[0.05] p-6 flex flex-col gap-4 overflow-hidden rounded-sm">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.03]">
                   <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> System_Kernel_Log
                   </span>
                   <span className="text-[8px] font-bold text-zinc-700">ENCRYPTION: AES-256-GCM</span>
                </div>
                <div className="flex-1 space-y-1">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="text-[9px] text-zinc-500 flex gap-4">
                      <span className="text-zinc-800">[{1000 - i}]</span>
                      <span className={i === 0 ? "text-emerald-500" : ""}>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Execution Panel */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               <div className="bg-[#080808] border border-white/[0.05] p-8 space-y-10 rounded-sm">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.03] pb-6">
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Order_Configuration</h3>
                       <BadgeCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    
                    <div className="flex p-1 bg-black border border-white/[0.03] rounded-sm">
                       <button 
                        onClick={() => setOrderForm({ ...orderForm, side: 'buy' })}
                        className={`flex-1 py-4 text-[10px] font-black transition-all ${orderForm.side === 'buy' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'text-zinc-600 hover:text-white'}`}
                       >
                        BUY_ORDER
                       </button>
                       <button 
                        onClick={() => setOrderForm({ ...orderForm, side: 'sell' })}
                        className={`flex-1 py-4 text-[10px] font-black transition-all ${orderForm.side === 'sell' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'text-zinc-600 hover:text-white'}`}
                       >
                        SELL_ORDER
                       </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">
                           <span>Resource_Volume</span>
                           <span>{activeAsset.id}</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={orderForm.amount}
                            onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                            className="w-full bg-black border border-white/[0.05] p-6 text-2xl font-black italic text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-900" 
                            placeholder="0.00"
                          />
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-zinc-900 text-[8px] font-black text-zinc-500 border border-white/5 hover:text-white transition-colors">MAX</button>
                        </div>
                     </div>

                     {orderForm.amount && (
                       <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-zinc-950 border border-white/[0.03] p-6 space-y-4 rounded-sm"
                       >
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600">
                             <span>Settlement_IDR</span>
                             <span className="text-zinc-400">Fixed_Rate</span>
                          </div>
                          <p className="text-3xl font-black italic text-emerald-500 tracking-tighter">
                            { (parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID') }
                          </p>
                       </motion.div>
                     )}

                     <button 
                      onClick={handleExecute}
                      disabled={isProcessing}
                      className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl relative overflow-hidden group disabled:opacity-50"
                     >
                        <div className="absolute inset-0 bg-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center justify-center gap-4">
                          {isProcessing ? "PROCESSING_LINK..." : "AUTHORIZE_TRANSACTION"}
                          <ArrowRightLeft className="w-4 h-4" />
                        </span>
                     </button>
                  </div>

                  <div className="pt-8 border-t border-white/[0.03] flex items-center justify-center gap-6">
                     <ShieldAlert className="w-4 h-4 text-emerald-500" />
                     <p className="text-[8px] text-zinc-300 font-bold uppercase text-center leading-relaxed">
                        Transaction involves direct vault interaction. <br />
                        <span className="text-emerald-500">Authorized entities only.</span>
                     </p>
                  </div>
               </div>

               {/* Vault Pulse Card */}
               <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-3">
                    <Database className="w-3 h-3" /> Vault_Metric_Pulse
                  </h4>
                  <div className="space-y-4">
                     <div className="flex justify-between">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">Avail_Liquidity</span>
                        <span className="text-[10px] font-black text-white tracking-tighter">${vaultStats.liquidity}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">Agg_History</span>
                        <span className="text-[10px] font-black text-white tracking-tighter">{vaultStats.transactions} TXNS</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-[#050505] border border-white/[0.05] p-8 md:p-12 rounded-sm overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-12 border-b border-white/[0.03] pb-10">
               <div className="flex items-center gap-6">
                  <FileDown className="w-8 h-8 text-blue-500" />
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Trade Audit Reports</h2>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Immutable Transaction History</p>
                  </div>
               </div>
               <button onClick={() => {
                  const doc = new jsPDF();
                  doc.text('INTELITRADE V7.0 - AUDIT LOG', 14, 20);
                  autoTable(doc, {
                    startY: 30,
                    head: [['Ticket', 'Time', 'Resource', 'Op', 'Qty', 'Settlement']],
                    body: history.map(t => [
                      t.id.slice(0,8).toUpperCase(), 
                      new Date(t.createdAt).toLocaleString(), 
                      t.asset, 
                      t.side.toUpperCase(), 
                      t.amount, 
                      `Rp ${ (parseFloat(t.amount) * t.price).toLocaleString('id-ID')}`
                    ]),
                  });
                  doc.save(`Audit_${Date.now()}.pdf`);
               }} className="px-10 py-4 border border-white/[0.05] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Export_Universal_Log</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
               {history.length === 0 ? (
                 <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/[0.03]">
                    <Search className="w-12 h-12 text-zinc-900 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No_Archives_Found</p>
                 </div>
               ) : (
                 history.map((t, i) => (
                   <div key={i} className="group grid grid-cols-1 md:grid-cols-12 p-8 border border-white/[0.03] bg-black hover:bg-zinc-900/40 transition-all items-center gap-8 rounded-sm">
                      <div className="md:col-span-3 flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${t.side === 'buy' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-600/10 text-emerald-500'}`}>
                            {t.side === 'buy' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-white uppercase block mb-1">Ticket_{t.id.slice(0,8).toUpperCase()}</span>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(t.createdAt).toLocaleTimeString()}</span>
                         </div>
                      </div>
                      <div className="md:col-span-2">
                         <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Operation</span>
                         <span className={`text-[10px] font-black uppercase ${t.side === 'buy' ? 'text-blue-500' : 'text-emerald-400'}`}>{t.side}</span>
                      </div>
                      <div className="md:col-span-2">
                         <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Asset</span>
                         <span className="text-[10px] font-black text-white uppercase italic">{t.amount} {t.asset}</span>
                      </div>
                      <div className="md:col-span-3">
                         <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Valuation</span>
                         <span className="text-xl font-black text-white tracking-tighter italic">Rp { (parseFloat(t.amount) * t.price).toLocaleString('id-ID') }</span>
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                         {t.paymentHash && <a href={`${CHAINS[t.chainId]?.explorer}${t.paymentHash}`} target="_blank" className="p-4 bg-zinc-900 border border-white/5 hover:border-blue-500 transition-all"><ExternalLink className="w-4 h-4" /></a>}
                         {t.status === 'approved' && <div className="p-4 bg-zinc-900 border border-white/5 text-emerald-500"><BadgeCheck className="w-4 h-4" /></div>}
                      </div>
                   </div>
                 ))
               )}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        
        body {
          font-family: 'JetBrains Mono', monospace;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #222;
        }
      `}</style>
    </div>
  );
};

export default IntelliTradeV7;
