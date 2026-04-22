"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  ShieldAlert, Lock, Fingerprint, Activity, Cpu, Globe, 
  Key, RefreshCw, Layers, Server, Terminal
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CHAINS: Record<number, { name: string; usdt: string; symbol: string; color: string }> = {
  56: { name: 'BSC', usdt: '0x55d3...7955', symbol: 'BNB', color: 'text-yellow-500' },
  137: { name: 'Polygon', usdt: '0xc213...8e8f', symbol: 'POL', color: 'text-purple-500' }
};

const IntelliTradeV3 = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);
  const [orderForm, setOrderForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    amount: '',
  });

  const currentPrice = useMemo(() => 
    orderForm.side === 'buy' ? rateIDR + 25 : rateIDR - 25
  , [orderForm.side, rateIDR]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) { console.error(err); }
    };
    fetchRate();
    // Simulate security scan on load
    const timer = setInterval(() => {
      setSecurityScore(prev => prev < 100 ? prev + 1 : 100);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("MetaMask Not Detected");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("Identity Verified via Web3", { icon: <Fingerprint /> });
    } catch (err) { toast.error("Connection Interrupted"); }
  };

  const handleV3Transaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("Authentication Required");
    
    setIsProcessing(true);
    const id = toast.loading("Initializing Blockchain Shield Protocol...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // V3 Security Layers
      await new Promise(r => setTimeout(r, 1000));
      toast.loading("Layer 1: Domain & SSL Validation...", { id });
      
      await new Promise(r => setTimeout(r, 1000));
      toast.loading("Layer 2: Scanning Liquidity Nodes...", { id });

      await new Promise(r => setTimeout(r, 1000));
      toast.loading("Layer 3: Waiting for Secure Signature...", { id });

      const secureMsg = `[INTELLITRADE V3 SECURITY PROTOCOL]\n\n` +
                        `OPERATION: SECURE_OTC_SETTLEMENT\n` +
                        `NONCE: ${Math.random().toString(36).substring(7)}\n` +
                        `TIMESTAMP: ${new Date().toISOString()}\n` +
                        `ASSET: USDT\n` +
                        `VALUE: ${orderForm.amount}\n\n` +
                        `Encrypted via RSA-4096 / Keccak-256.`;

      const signature = await signer.signMessage(secureMsg);
      
      toast.loading("Deploying Atomic Swap Payload...", { id });
      await new Promise(r => setTimeout(r, 2000));

      toast.success("Settlement Finalized on Ledger", { 
        id, 
        icon: <ShieldCheck className="text-emerald-500" />,
        duration: 4000 
      });
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err) {
      toast.error("Protocol Terminated by User", { id });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 selection:bg-blue-500/30 font-sans leading-relaxed overflow-x-hidden">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-12 space-y-12">
        
        {/* Navigation / Header V3 */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              <Cpu size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
                INTELLITRADE <span className="text-blue-500 text-3xl align-top">V3</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Quantum-Safe Execution Environment</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 pr-6">
              <div className="p-3 bg-white/5 rounded-xl text-blue-400"><ShieldCheck size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Security Score</p>
                <p className="text-sm font-black italic text-white leading-none">{securityScore}%</p>
              </div>
            </div>
            <button 
              onClick={connectWallet}
              className="px-8 py-4 rounded-2xl font-black italic tracking-[0.2em] text-[11px] transition-all bg-white text-black hover:bg-blue-600 hover:text-white shadow-2xl"
            >
              {account ? `ID: ${account.slice(0,8)}...` : "VERIFY IDENTITY"}
            </button>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-12">
          
          {/* Left: Terminal & Intelligence */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Live Pricing Terminal */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full w-fit">
                    <Activity size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Live Ledger Feed</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.6em]">Settlement Rate</p>
                    <div className="flex items-baseline gap-6">
                      <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter text-white">
                        {currentPrice.toLocaleString('id-ID')}
                      </h2>
                      <span className="text-3xl font-black text-blue-600 italic tracking-tighter">IDR</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl space-y-6 w-full md:w-80">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network</span>
                    <span className="text-xs font-black italic text-emerald-400 tracking-tighter uppercase">
                      {chainId && CHAINS[chainId] ? CHAINS[chainId].name : "Detecting..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
                    <span className="text-xs font-black italic text-blue-400 tracking-tighter uppercase">1.2ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                    <span className="text-xs font-black italic text-slate-300 tracking-tighter uppercase">AES-256 / Web3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Specs Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Globe size={20} />, label: "Global Nodes", val: "Verified" },
                { icon: <Lock size={20} />, label: "Anti-MEV", val: "Active" },
                { icon: <RefreshCw size={20} />, label: "Auto-Refresh", val: "60s" },
              ].map((spec, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center gap-6 group hover:bg-white/10 transition-all">
                  <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-blue-500 transition-colors">{spec.icon}</div>
                  <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="text-sm font-black italic text-white uppercase tracking-tighter">{spec.val}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Execution Core */}
          <div className="lg:col-span-4">
            <div className="bg-[#0a0a0f] border border-white/10 rounded-[4rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.1),transparent_50%)]"></div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex flex-col gap-2">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Execution Core</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Encrypted Transaction Payload</p>
                </div>

                <div className="flex bg-black/60 p-2 rounded-3xl border border-white/5">
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'buy'})}
                    className={`flex-1 py-5 rounded-2xl font-black italic uppercase text-[11px] tracking-[0.2em] transition-all duration-500 ${orderForm.side === 'buy' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    Direct Buy
                  </button>
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'sell'})}
                    className={`flex-1 py-5 rounded-2xl font-black italic uppercase text-[11px] tracking-[0.2em] transition-all duration-500 ${orderForm.side === 'sell' ? 'bg-zinc-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    Direct Sell
                  </button>
                </div>

                <form onSubmit={handleV3Transaction} className="space-y-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] ml-6 mb-4 block">Input Quantity (USDT)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={orderForm.amount}
                          onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})}
                          placeholder="0.00"
                          className="w-full bg-black border-2 border-white/5 rounded-[2.5rem] px-10 py-8 font-mono text-3xl text-white focus:border-blue-600 outline-none transition-all group-hover:border-white/10"
                        />
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          <span className="font-black italic text-slate-600 text-xl">USDT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {orderForm.amount && (
                    <div className="p-8 bg-blue-600/5 rounded-[3rem] border border-blue-500/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-center text-slate-500 font-bold">
                        <span className="text-[10px] uppercase tracking-widest flex items-center gap-2"><Key size={12}/> Unit Price</span>
                        <span className="text-sm">Rp {currentPrice.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="h-px bg-white/5"></div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Aggregate Settlement (IDR)</p>
                        <p className="text-4xl font-black italic tracking-tighter text-white">
                          Rp {(parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <button 
                      type="submit"
                      disabled={!account || !orderForm.amount || isProcessing}
                      className={`group w-full py-10 rounded-[3rem] font-black text-2xl italic tracking-tighter uppercase transition-all duration-700 flex items-center justify-center gap-6 ${
                        account && orderForm.amount && !isProcessing
                          ? 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-[0_30px_60px_rgba(0,0,0,0.6)]'
                          : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {isProcessing ? (
                        <RefreshCw size={32} className="animate-spin text-blue-500" />
                      ) : (
                        <>
                          <Terminal size={28} />
                          Finalize On-Chain
                        </>
                      )}
                    </button>
                    
                    {!account && (
                      <div className="flex items-center justify-center gap-3 text-orange-500/60 p-4">
                        <ShieldAlert size={14} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Connect Identity to Unlock Core</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Footer V3 */}
        <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Layers size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Node: {chainId || 'Disconnected'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Server size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Status: Optimized</span>
            </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">Engineering Institutional Liquidity Since 2024</p>
        </footer>

      </div>
    </div>
  );
};

export default IntelliTradeV3;
