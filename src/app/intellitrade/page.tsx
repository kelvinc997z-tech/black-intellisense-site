"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  ShieldAlert, Lock, Fingerprint, Activity, Cpu, Globe, 
  Key, RefreshCw, Layers, Server, Terminal, Radio, 
  Database, ZapOff, HardDrive, BarChart3, ScanFace
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

const IntelliTradeV5 = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [neuralStatus, setNeuralStatus] = useState("INITIALIZING");
  const [blocks, setBlocks] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    amount: '',
  });

  const currentPrice = useMemo(() => 
    orderForm.side === 'buy' ? rateIDR + 12.5 : rateIDR - 12.5
  , [orderForm.side, rateIDR]);

  // Simulate Live Ledger Data
  useEffect(() => {
    const interval = setInterval(() => {
      const hash = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
      setBlocks(prev => [hash, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) { console.error(err); }
    };
    fetchRate();
    const statuses = ["QUANTUM_SCAN", "NEURAL_SYNC", "ENCLAVE_READY", "SHIELD_ACTIVE"];
    let i = 0;
    const timer = setInterval(() => {
      setNeuralStatus(statuses[i % statuses.length]);
      i++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("NEURAL_LINK_FAILED: No Provider");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("BIOMETRIC_AUTH_SUCCESS", { 
        description: `Verified Address: ${accounts[0].slice(0,10)}...`,
        icon: <ScanFace className="text-emerald-400" /> 
      });
    } catch (err) { toast.error("HANDSHAKE_REJECTED"); }
  };

  const handleV5Execution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("SYSTEM_LOCKED: Auth Required");
    
    setIsProcessing(true);
    const toastId = toast.loading("INITIALIZING ATOMIC SWAP PROTOCOL V5...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const sequence = [
        "ENCRYPTING PAYLOAD (RSA-8192)",
        "ROUTING VIA SHIELD NODES",
        "NEURAL SIGNATURE HANDSHAKE",
        "EXECUTING ON-CHAIN SETTLEMENT"
      ];

      for (const step of sequence) {
        toast.loading(step, { id: toastId });
        await new Promise(r => setTimeout(r, 1200));
      }

      const v5Msg = `[BLACKINTELLISENSE V5 CORE]\n` +
                    `---------------------------\n` +
                    `UID: ${account.toUpperCase()}\n` +
                    `NONCE: ${ethers.keccak256(ethers.toUtf8Bytes(Date.now().toString())).slice(0,16)}\n` +
                    `VOLUME: ${orderForm.amount} USDT\n` +
                    `RATE: ${currentPrice}\n` +
                    `SECURITY: ZERO_KNOWLEDGE_PROOF_V5\n` +
                    `---------------------------\n` +
                    `CONFIRM TRANSACTION`;

      await signer.signMessage(v5Msg);
      
      toast.success("SETTLEMENT_SUCCESSFUL", { 
        id: toastId, 
        description: "Transaction finalized on decentralized ledger.",
        icon: <ShieldCheck className="text-emerald-500" />,
        duration: 5000 
      });
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err) {
      toast.error("PROTOCOL_ABORTED", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010102] text-zinc-300 selection:bg-blue-600/50 font-mono overflow-hidden">
      
      {/* V5 Matrix Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.05),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(29,78,216,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col p-4 md:p-8">
        
        {/* Top Status Bar */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-[0.5em] text-white flex items-center gap-2">
                <Cpu size={18} className="text-blue-500 animate-pulse" />
                INTELLITRADE <span className="text-blue-600">V.5</span>
              </h1>
              <span className="text-[8px] text-zinc-600 tracking-[0.8em] font-bold">MILITARY-GRADE OTC INTERFACE</span>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex flex-col">
                <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Neural Status</span>
                <span className="text-[9px] font-bold text-emerald-500 tracking-tighter">{neuralStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col text-right">
                <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Active Ledger</span>
                <span className="text-[9px] font-bold text-blue-400">
                  {chainId ? CHAINS[chainId]?.name : "SCANNING_FOR_NODES..."}
                </span>
             </div>
             <button 
              onClick={connectWallet}
              className="px-6 py-2 border border-white/10 rounded-sm hover:bg-white hover:text-black transition-all text-[9px] font-black tracking-[0.3em] uppercase"
             >
              {account ? `[ AUTH_ID: ${account.slice(0,10)} ]` : "INITIALIZE_LINK"}
             </button>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* Left Panel: Analytics & Feed */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
            
            {/* Primary Ledger Terminal */}
            <div className="flex-1 bg-black border border-white/5 rounded-sm p-8 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={120} /></div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                  <span className="text-[9px] font-black text-blue-500 tracking-[0.5em] uppercase">Real-Time Liquidity Index</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-[12vw] lg:text-[10vw] font-black italic tracking-tighter text-white leading-none">
                    {currentPrice.toLocaleString('id-ID')}
                  </h2>
                  <span className="text-2xl font-black text-zinc-800 uppercase tracking-widest">IDR</span>
                </div>
                <div className="mt-8 flex gap-12">
                   <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-1">Spread</span>
                      <span className="text-xs font-bold text-emerald-400">0.08% (OPTIMIZED)</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-1">Volume 24h</span>
                      <span className="text-xs font-bold text-white">8.42M USDT</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-600 uppercase tracking-[0.4em] mb-1">Status</span>
                      <span className="text-xs font-bold text-blue-500">LIQUIDITY_DEPTH_OK</span>
                   </div>
                </div>
              </div>

              {/* Bottom Data Tape */}
              <div className="h-20 border-t border-white/5 mt-8 flex items-center gap-8 overflow-hidden">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Radio size={12} className="animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Latest Blocks</span>
                </div>
                {blocks.map((b, i) => (
                  <div key={i} className="flex flex-col animate-in fade-in slide-in-from-right-4">
                    <span className="text-[6px] text-zinc-600 uppercase mb-0.5">TX_HASH</span>
                    <span className="text-[9px] font-mono text-zinc-400 font-bold">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Stats */}
            <div className="grid grid-cols-3 gap-6 h-32">
              {[
                { icon: <HardDrive size={16}/>, label: "Encrypted Storage", val: "AES-512-GCM" },
                { icon: <Layers size={16}/>, label: "Node Latency", val: "0.84ms" },
                { icon: <Activity size={16}/>, label: "Network Load", val: "2.1%" },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/20 border border-white/5 rounded-sm p-6 flex items-center gap-4">
                   <div className="text-zinc-600">{stat.icon}</div>
                   <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</span>
                      <span className="text-[10px] font-bold text-zinc-300">{stat.val}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Command Center */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-[#050505] border border-white/10 rounded-sm p-8 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.05),transparent_40%)]"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="mb-10 flex flex-col">
                  <h3 className="text-lg font-black tracking-[0.2em] text-white italic uppercase flex items-center gap-3">
                    <Terminal size={18} className="text-blue-600" />
                    Command Center
                  </h3>
                  <div className="h-0.5 w-12 bg-blue-600 mt-2"></div>
                </div>

                <div className="flex bg-zinc-900/30 p-1 mb-8 rounded-sm">
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'buy'})}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'buy' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    Load Beli
                  </button>
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'sell'})}
                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${orderForm.side === 'sell' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    Load Jual
                  </button>
                </div>

                <form onSubmit={handleV5Execution} className="flex-1 flex flex-col">
                   <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                        <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] block">Execute_Amount (USDT)</label>
                        <div className="relative">
                          <input 
                            type="number"
                            value={orderForm.amount}
                            onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})}
                            placeholder="0.00"
                            className="w-full bg-black border border-white/10 rounded-sm px-6 py-5 text-2xl font-black text-white focus:border-blue-600 outline-none"
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700 uppercase tracking-widest">Token_USDT</span>
                        </div>
                      </div>

                      {orderForm.amount && (
                        <div className="bg-zinc-900/30 border-l-2 border-blue-600 p-6 space-y-4 animate-in slide-in-from-left-2 duration-300">
                          <div className="flex justify-between">
                            <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Rate Locked</span>
                            <span className="text-[10px] font-bold text-zinc-300">Rp {currentPrice.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7px] text-blue-600 uppercase tracking-[0.5em] mb-1">Final Settlement</span>
                            <span className="text-3xl font-black text-white italic tracking-tighter">
                              Rp {(parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="mt-8 space-y-4">
                      <button 
                        type="submit"
                        disabled={!account || !orderForm.amount || isProcessing}
                        className={`w-full py-6 rounded-sm font-black text-xs tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-4 ${
                          account && orderForm.amount && !isProcessing
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_0_40px_rgba(37,99,235,0.2)]'
                            : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing ? (
                          <RefreshCw size={20} className="animate-spin" />
                        ) : (
                          <>
                            <Zap size={16} />
                            Execute_V5_Protocol
                          </>
                        )}
                      </button>
                      
                      <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                            <Lock size={10} className="text-zinc-700" />
                            <span className="text-[6px] text-zinc-700 uppercase tracking-widest">End-to-End Encrypted</span>
                         </div>
                         <div className="flex items-center gap-2 text-zinc-800 hover:text-zinc-600 transition-colors cursor-help">
                            <Info size={10} />
                            <span className="text-[6px] uppercase tracking-widest">System Docs</span>
                         </div>
                      </div>
                   </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Matrix Feed */}
        <footer className="mt-6 flex justify-between items-center text-[7px] font-bold text-zinc-800 uppercase tracking-[0.8em]">
           <div className="flex gap-10">
              <span>System_Core: 0.1.0-V5</span>
              <span>Memory: Optimized</span>
              <span>Buffer: Secure</span>
           </div>
           <div>© 2024 BlackIntellisense Engineering</div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
        .scan-line { position: absolute; width: 100%; height: 2px; background: rgba(37, 99, 235, 0.2); animation: scan 4s linear infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; }
      `}</style>
    </div>
  );
};

export default IntelliTradeV5;
