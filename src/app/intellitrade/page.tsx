"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CHAINS: Record<number, { name: string; usdt: string; symbol: string }> = {
  56: { name: 'BSC', usdt: '0x55d3...7955', symbol: 'BNB' },
  137: { name: 'Polygon', usdt: '0xc213...8e8f', symbol: 'POL' }
};

const IntelliTradePage = () => {
  const [rateIDR, setRateIDR] = useState<number>(16250);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderForm, setOrderForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    amount: '',
  });

  // Simulasi Harga Berdasarkan Live Rate
  const currentPrice = orderForm.side === 'buy' ? rateIDR + 25 : rateIDR - 25;

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates?.IDR) setRateIDR(data.rates.IDR);
      } catch (err) { console.error(err); }
    };
    fetchRate();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("MetaMask tidak terdeteksi!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("Wallet Connected");
    } catch (err) { toast.error("Koneksi gagal"); }
  };

  const handleSimulatedTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("Hubungkan wallet!");
    
    const config = CHAINS[Number(chainId)];
    if (!config) return toast.error("Harap pindah ke jaringan BSC atau Polygon!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // SIMULASI SMART CONTRACT INTERACTION
      // Dalam sistem asli, ini akan memanggil contract.buyUSDT{value: payment}()
      
      const totalIDR = parseFloat(orderForm.amount) * currentPrice;
      const message = `[SMART CONTRACT SIMULATION]\n\n` +
                      `Anda akan membeli ${orderForm.amount} USDT\n` +
                      `Melalui Smart Contract Escrow.\n\n` +
                      `Estimasi Pembayaran: Rp ${totalIDR.toLocaleString('id-ID')}\n` +
                      `Jaringan: ${config.name}\n\n` +
                      `Kontrak akan secara otomatis mengirimkan USDT ke dompet Anda setelah dana diterima.`;

      toast.info("Menunggu tanda tangan persetujuan kontrak...");
      
      // Menggunakan signMessage untuk mensimulasikan otorisasi transaksi ke kontrak
      const signature = await signer.signMessage(message);
      console.log("Contract Call Authorized:", signature);

      const loadingToast = toast.loading("Smart Contract: Verifikasi likuiditas & memproses swap...");
      
      // Simulasi delay blockchain
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success(`Berhasil! ${orderForm.amount} USDT telah dikirim ke dompet Anda oleh Smart Contract.`, {
          duration: 5000,
          icon: <ShieldCheck className="text-emerald-500" />
        });
        setOrderForm({ ...orderForm, amount: '' });
        setIsProcessing(false);
      }, 3000);

    } catch (err: any) {
      toast.error("Transaksi Dibatalkan.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
              IntelliTrade <span className="text-blue-500">v2.0</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs flex items-center gap-2">
              <Zap size={14} className="text-blue-500" /> Smart Contract Escrow Simulation
            </p>
          </div>

          <button 
            onClick={connectWallet}
            className={`px-8 py-3 rounded-full font-black italic tracking-widest text-xs transition-all border ${
              account 
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                : 'border-white/10 bg-white/5 hover:bg-blue-600 hover:border-blue-500'
            }`}
          >
            {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "CONNECT WALLET"}
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Info & Live Price */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                  <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase">Live Market Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connected</span>
                  </div>
                </div>

                <div>
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] mb-4">USDT / IDR</p>
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter">
                      {currentPrice.toLocaleString('id-ID')}
                    </h2>
                    <span className="text-2xl font-black text-zinc-700 italic uppercase">IDR</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Network Status</p>
                    <p className="text-sm font-bold text-blue-400 uppercase tracking-tighter">
                      {chainId && CHAINS[chainId] ? `${CHAINS[chainId].name} Mainnet` : "Detecting..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Vault Liquidity</p>
                    <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">1,250,000.00 USDT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/20 rounded-[2rem] p-8 flex gap-6 items-start">
              <div className="p-3 bg-blue-500 rounded-2xl"><Info className="text-white" /></div>
              <div className="space-y-2">
                <h4 className="font-black italic uppercase tracking-tighter text-blue-400">Cara Kerja Smart Contract</h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Berbeda dengan transfer manual, Smart Contract bertindak sebagai pihak ketiga yang netral. Saat Anda menekan eksekusi, kontrak akan memastikan stok USDT tersedia sebelum menarik dana Anda. Proses ini terjadi dalam satu instruksi atomik (Atomic Swap).
                </p>
              </div>
            </div>
          </div>

          {/* Right: Interaction Form */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Execute Trade</h3>
                
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'buy'})}
                    className={`flex-1 py-4 rounded-xl font-black italic uppercase text-xs tracking-widest transition-all ${orderForm.side === 'buy' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    Buy USDT
                  </button>
                  <button 
                    onClick={() => setOrderForm({...orderForm, side: 'sell'})}
                    className={`flex-1 py-4 rounded-xl font-black italic uppercase text-xs tracking-widest transition-all ${orderForm.side === 'sell' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    Sell USDT
                  </button>
                </div>

                <form onSubmit={handleSimulatedTransaction} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block">Amount to {orderForm.side}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={orderForm.amount}
                          onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})}
                          placeholder="0.00"
                          className="w-full bg-black border-2 border-white/5 rounded-3xl px-8 py-6 font-mono text-2xl focus:border-blue-600 outline-none transition-all group-hover:border-white/10"
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black italic text-zinc-700">USDT</span>
                      </div>
                    </div>
                  </div>

                  {orderForm.amount && (
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Price per unit</span>
                        <span className="font-mono text-sm font-bold text-zinc-300">Rp {currentPrice.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Estimated</span>
                        <span className="text-2xl font-black italic tracking-tighter">
                          Rp {(parseFloat(orderForm.amount) * currentPrice).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={!account || !orderForm.amount || isProcessing}
                    className={`w-full py-8 rounded-[2rem] font-black text-xl italic tracking-tighter uppercase transition-all flex items-center justify-center gap-4 ${
                      account && orderForm.amount && !isProcessing
                        ? 'bg-white text-black hover:bg-blue-600 hover:text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-4 border-zinc-500 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ArrowRightLeft size={24} />
                        Execute Smart Contract
                      </>
                    )}
                  </button>
                  
                  {!account && (
                    <p className="text-center text-[10px] font-black text-orange-500 uppercase tracking-widest">Connect wallet to authorize contract</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelliTradePage;
