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
  const [view, setView] = useState<'terminal' | 'reports' | 'admin'>('terminal');
  const [blocks, setBlocks] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({ side: 'buy', amount: '' });
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  const isAdmin = useMemo(() => account?.toLowerCase() === DEALER_WALLET.toLowerCase(), [account]);

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

  useEffect(() => {
    const handleChainChanged = (id: string) => setChainId(parseInt(id, 16));
    const handleAccountsChanged = (accs: string[]) => setAccount(accs[0] || null);

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      window.ethereum.request({ method: 'eth_accounts' }).then((accs: string[]) => {
        if (accs.length > 0) {
          setAccount(accs[0]);
          window.ethereum.request({ method: 'eth_chainId' }).then((id: string) => {
            setChainId(parseInt(id, 16));
          });
        }
      });
    }

    const savedPending = localStorage.getItem('pending_orders');
    if (savedPending) setPendingOrders(JSON.parse(savedPending));
    
    const savedHistory = localStorage.getItem('trade_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const userPending = useMemo(() => {
    if (!account) return [];
    const acc = account.toLowerCase();
    if (acc === DEALER_WALLET.toLowerCase()) return pendingOrders; 
    return pendingOrders.filter(p => p.targetAddress.toLowerCase() === acc);
  }, [pendingOrders, account]);

  const userHistory = useMemo(() => {
    if (!account) return [];
    const acc = account.toLowerCase();
    if (acc === DEALER_WALLET.toLowerCase()) return history;
    return history.filter(h => h.owner?.toLowerCase() === acc);
  }, [history, account]);

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    toast.success("Wallet Disconnected");
  };

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
    if (!orderForm.amount || parseFloat(orderForm.amount) <= 0) return toast.error("Input Valid Amount");

    const isBuy = orderForm.side === 'buy';
    setIsProcessing(true);
    
    try {
      if (isBuy) {
        const tId = toast.loading("Submitting Institutional Buy Request...");
        const newOrder = {
          id: "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
          targetAddress: account.toLowerCase(),
          asset: activeAsset.id,
          amount: orderForm.amount,
          price: currentPrice,
          date: new Date().toLocaleString(),
          status: 'pending_approval'
        };
        
        const saved = localStorage.getItem('pending_orders');
        const currentPending = saved ? JSON.parse(saved) : [];
        const updatedPending = [newOrder, ...currentPending];
        
        setPendingOrders(updatedPending);
        localStorage.setItem('pending_orders', JSON.stringify(updatedPending));

        toast.success("Request Submitted. Awaiting Admin Approval.", { id: tId });
        setOrderForm(prev => ({ ...prev, amount: '' }));
      } else {
        const tId = toast.loading("Initiating Sell Transfer to Vault...");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const cid = Number(network.chainId);
        const isNative = activeAsset.id === 'BNB' || activeAsset.id === 'POL';
        
        let tx;
        if (isNative) {
          tx = await signer.sendTransaction({ to: DEALER_WALLET, value: ethers.parseEther(orderForm.amount) });
        } else {
          const config = CHAINS[cid];
          const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
          tx = await contract.transfer(DEALER_WALLET, ethers.parseUnits(orderForm.amount, 18));
        }
        await tx.wait();
        
        const newTrade = {
          id: tx.hash.slice(0,12),
          fullHash: tx.hash,
          date: new Date().toLocaleString(),
          asset: activeAsset.id,
          side: 'sell',
          amount: orderForm.amount,
          total: (parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID'),
          chain: cid === 56 ? 'BSC' : 'Polygon',
          owner: account.toLowerCase()
        };

        const savedHistory = localStorage.getItem('trade_history');
        const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = [newTrade, ...currentHistory];
        setHistory(updatedHistory);
        localStorage.setItem('trade_history', JSON.stringify(updatedHistory));

        toast.success("Asset Sent to Vault Successfully", { id: tId });
        setOrderForm(prev => ({ ...prev, amount: '' }));
      }
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const approveOrder = async (order: any) => {
    if (!isAdmin) return toast.error("Admin Only");
    setIsProcessing(true);
    const tId = toast.loading(`Approving Order ${order.id}...`);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const cid = Number(network.chainId);
      const isNative = order.asset === 'BNB' || order.asset === 'POL';

      let tx;
      if (isNative) {
        tx = await signer.sendTransaction({ to: order.targetAddress, value: ethers.parseEther(order.amount) });
      } else {
        const config = CHAINS[cid];
        const contract = new ethers.Contract(config.usdt, ["function transfer(address to, uint256 amount) public returns (bool)"], signer);
        tx = await contract.transfer(order.targetAddress, ethers.parseUnits(order.amount, 18));
      }
      await tx.wait();
      
      const newTrade = {
        id: tx.hash.slice(0,12),
        fullHash: tx.hash,
        date: new Date().toLocaleString(),
        asset: order.asset,
        side: 'buy',
        amount: order.amount,
        total: (parseFloat(order.amount) * order.price).toLocaleString('id-ID'),
        chain: cid === 56 ? 'BSC' : 'Polygon',
        status: 'approved',
        owner: order.targetAddress.toLowerCase()
      };

      const savedHistory = localStorage.getItem('trade_history');
      const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
      const updatedHistory = [newTrade, ...currentHistory];
      setHistory(updatedHistory);
      localStorage.setItem('trade_history', JSON.stringify(updatedHistory));

      const updatedPending = pendingOrders.filter(p => p.id !== order.id);
      setPendingOrders(updatedPending);
      localStorage.setItem('pending_orders', JSON.stringify(updatedPending));
      
      toast.success("Order Approved & Assets Sent!", { id: tId });
    } catch (err: any) {
      toast.error(err.message || "Approval failed");
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
      body: userHistory.map(t => [t.id, t.date, t.asset, t.side, t.amount, t.total]),
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
            {isAdmin && (
              <button onClick={() => setView('admin')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}>Vault Admin</button>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button 
              onClick={account ? disconnectWallet : connectWallet} 
              className="px-8 py-3 bg-zinc-900 border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all flex flex-col items-center gap-1 group relative"
            >
              <span>{account ? `KYB: ${account.slice(0,8)}...` : "VERIFY ENTITY"}</span>
              {account && chainId && (
                <span className="text-[8px] text-blue-500 font-bold border-t border-white/5 pt-1 w-full text-center">
                  NETWORK: {CHAINS[chainId]?.name || `ID ${chainId}`}
                </span>
              )}
              {account && (
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  CLICK TO SIGN OUT
                </span>
              )}
            </button>
          </div>
        </header>

        {view === 'terminal' ? (
            // ... (keep terminal code)
        ) : view === 'admin' ? (
          <main className="flex-1 bg-black border border-red-500/20 p-12 overflow-y-auto rounded-[3rem] shadow-[0_0_50px_rgba(239,68,68,0.1)]">
             <div className="flex justify-between items-end mb-12 pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-4xl font-black italic uppercase text-red-500 font-heading">Vault Command</h2>
                  <p className="text-[10px] tracking-widest text-zinc-600 uppercase mt-2 font-sans">Institutional Approval Authority</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-zinc-900 px-6 py-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-zinc-600 uppercase mb-1">Queue Depth</p>
                    <p className="text-xl font-black text-white">{pendingOrders.length}</p>
                  </div>
                </div>
             </div>

             <div className="space-y-6 font-mono">
                {pendingOrders.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                    <p className="text-zinc-600 uppercase text-[10px] tracking-[0.5em]">No Pending Requests In Queue</p>
                  </div>
                ) : (
                  pendingOrders.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 p-8 border border-red-500/20 bg-red-500/5 items-center rounded-[2rem] gap-6 hover:bg-red-500/10 transition-all group">
                       <div className="col-span-2 flex flex-col">
                          <span className="text-[8px] text-zinc-600 mb-1 font-sans uppercase">Order ID</span>
                          <span className="text-xs font-bold text-red-400">{p.id}</span>
                       </div>
                       <div className="col-span-4 flex flex-col">
                          <span className="text-[8px] text-zinc-600 mb-1 font-sans uppercase">Destination Wallet</span>
                          <span className="text-[10px] font-bold text-zinc-400 truncate">{p.targetAddress}</span>
                       </div>
                       <div className="col-span-2 flex flex-col">
                          <span className="text-[8px] text-zinc-600 mb-1 font-sans uppercase">Asset / Qty</span>
                          <span className="text-xs font-black text-white">{p.amount} {p.asset}</span>
                       </div>
                       <div className="col-span-2 flex flex-col">
                          <span className="text-[8px] text-zinc-600 mb-1 font-sans uppercase">Total Value</span>
                          <span className="text-xs font-bold text-zinc-400">Rp { (parseFloat(p.amount) * p.price).toLocaleString('id-ID') }</span>
                       </div>
                       <div className="col-span-2 text-right">
                          <button 
                            onClick={() => approveOrder(p)} 
                            className="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all shadow-lg shadow-red-600/20"
                          >
                            Execute Release
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </main>
        ) : (
          <main className="flex-1 bg-black border border-white/5 p-12 overflow-y-auto rounded-[3rem]">
             <div className="flex justify-between items-end mb-12 pb-8 border-b border-white/5">
                <div><h2 className="text-4xl font-black italic uppercase text-white font-heading font-heading">Audit Logs</h2><p className="text-[10px] tracking-widest text-zinc-600 uppercase mt-2 font-sans">Institutional Ledger History</p></div>
                <button onClick={exportPDF} className={`flex items-center gap-3 px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full font-sans`}><FileDown size={18} /> Export PDF</button>
             </div>
             <div className="space-y-6 font-mono font-mono">
                {userPending.length > 0 && (
                  <div className="mb-10 space-y-4">
                    <h3 className="text-xl font-black text-blue-500 uppercase italic tracking-tighter">
                      {isAdmin ? "Admin: Pending Approvals" : "Your Pending Requests"}
                    </h3>
                    {userPending.map((p, i) => (
                      <div key={i} className={`grid grid-cols-6 p-8 border items-center rounded-3xl ${isAdmin ? 'border-blue-500/30 bg-blue-500/5 animate-pulse' : 'border-white/5 bg-zinc-900/50'}`}>
                         <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">ID</span><span className="text-sm font-bold text-blue-400">{p.id}</span></div>
                         <div className="flex flex-col col-span-2"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Wallet</span><span className="text-xs font-bold truncate">{p.targetAddress}</span></div>
                         <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Asset</span><span className="text-sm font-bold text-white">{p.asset}</span></div>
                         <div className="flex flex-col"><span className="text-[8px] text-zinc-600 mb-1 font-sans">Qty</span><span className="text-sm font-bold text-white">{p.amount}</span></div>
                         <div className="flex flex-col text-right">
                            {isAdmin ? (
                              <button onClick={() => approveOrder(p)} className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-white hover:text-black transition-all">Approve & Send</button>
                            ) : (
                              <span className="text-[10px] font-black text-zinc-500 uppercase italic">Awaiting Admin</span>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {userHistory.map((t, i) => (
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
    </div>
  );
};

export default IntelliTradeV6;
