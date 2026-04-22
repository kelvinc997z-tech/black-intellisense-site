"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Wallet, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CHAINS: Record<number, { name: string; usdt: string; explorer: string }> = {
  56: { name: 'BSC', usdt: '0x55d398326f99059fF775485246999027B3197955', explorer: 'https://bscscan.com/tx/' },
  137: { name: 'Polygon', usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', explorer: 'https://polygonscan.com/tx/' }
};

const DEALER_WALLET = "0x5678901234567890123456789012345678901234"; // GANTI DENGAN WALLET PENERIMA (DEALER)

const IntelliTradePage = () => {
  const [bestPrice, setBestPrice] = useState<any>(null);
  const [rateIDR, setRateIDR] = useState<number>(16000);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderForm, setOrderForm] = useState({
    symbol: 'USDT',
    side: 'buy' as 'buy' | 'sell',
    amount: '',
    price: ''
  });

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates && data.rates.IDR) setRateIDR(data.rates.IDR);
      } catch (err) { console.error("Failed to fetch IDR rate", err); }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const basePrice = rateIDR;
    const mockPrice = orderForm.side === 'buy' ? basePrice + 15 : basePrice - 15;
    setBestPrice({ best_price: mockPrice });
    setOrderForm(prev => ({ ...prev, price: mockPrice.toFixed(2) }));
  }, [orderForm.side, rateIDR]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error("MetaMask tidak terdeteksi!");
      return;
    }
    try {
      setIsConnecting(true);
      // Re-fetch provider to ensure fresh instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      toast.success("Connected to " + (CHAINS[Number(network.chainId)]?.name || 'Network'));
    } catch (err: any) { 
      console.error(err);
      toast.error("Gagal menghubungkan wallet: " + (err.message || "Unknown error")); 
    }
    finally { setIsConnecting(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked. Account:", account, "ChainID:", chainId);

    if (!window.ethereum) {
      toast.error("Ethereum provider tidak ditemukan!");
      return;
    }

    if (!account) {
      toast.error("Harap hubungkan wallet terlebih dahulu!");
      return;
    }
    
    const chainConfig = CHAINS[Number(chainId)];
    if (!chainConfig) {
      toast.error("Harap pindah ke jaringan BSC (56) atau Polygon (137) di MetaMask!");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Menginisialisasi transaksi...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // ABI Minimal untuk Transfer Token ERC20 (USDT)
      const usdtAbi = ["function transfer(address to, uint256 amount) public returns (bool)"];
      const usdtContract = new ethers.Contract(chainConfig.usdt, usdtAbi, signer);

      // Konversi jumlah ke unit token
      const decimals = Number(chainId) === 137 ? 6 : 18;
      const amountInUnits = ethers.parseUnits(orderForm.amount, decimals);

      console.log("Attempting transfer to:", DEALER_WALLET, "Amount units:", amountInUnits.toString());
      
      // Eksekusi Transaksi On-Chain
      // Gunakan cara manual sendTransaction jika contract call gagal popup
      const tx = await usdtContract.transfer(DEALER_WALLET, amountInUnits);
      
      console.log("Transaction sent:", tx.hash);

      toast.promise(tx.wait(), {
        loading: 'Menunggu konfirmasi blockchain...',
        success: (receipt: any) => {
          setOrderForm({ ...orderForm, amount: '' });
          return `Transaksi Berhasil! Hash: ${receipt.hash.slice(0,10)}...`;
        },
        error: 'Transaksi gagal di blockchain.'
      });

    } catch (err: any) {
      console.error("Detailed error:", err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error("Transaksi dibatalkan oleh pengguna.");
      } else {
        toast.error("Gagal memproses: " + (err.reason || err.message || "Cek konsol browser"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              IntelliTrade OTC Platform
            </h1>
            <p className="mt-2 text-base text-gray-500">On-Chain Transaction (BSC / Polygon)</p>
          </div>
          
          <div className="flex items-center gap-3">
            {chainId && CHAINS[chainId] && (
              <div className="px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-[10px] font-black text-blue-400">
                {CHAINS[chainId].name}
              </div>
            )}
            {account ? (
              <div className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            ) : (
              <button onClick={connectWallet} disabled={isConnecting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-lg shadow-orange-900/20">
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        {!account && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-center gap-3 text-orange-400 mb-6">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-bold">Harap hubungkan dompet MetaMask Anda sebelum melanjutkan transaksi.</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-6">Harga OTC Live</h3>
            {bestPrice && (
              <div className="rounded-2xl bg-blue-500/5 p-12 text-center border border-blue-500/20">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Rate USDT/IDR (Live)</p>
                <p className="mt-4 font-mono text-6xl font-bold text-blue-400">{bestPrice.best_price.toLocaleString('id-ID')}</p>
                <p className="mt-4 font-mono text-sm text-gray-600">Rupiah per USDT</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-xl font-semibold">Eksekusi Transaksi On-Chain</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
                ℹ️ Dana (USDT) akan dikirim langsung ke Dealer melalui Blockchain. Pastikan Anda memiliki saldo gas (BNB/POL) yang cukup.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setOrderForm({ ...orderForm, side: 'buy' })} className={"rounded-xl py-3 font-bold transition-all " + (orderForm.side === 'buy' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'border border-gray-800 text-gray-500 hover:bg-zinc-800')}>BELI</button>
                <button type="button" onClick={() => setOrderForm({ ...orderForm, side: 'sell' })} className={"rounded-xl py-3 font-bold transition-all " + (orderForm.side === 'sell' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'border border-gray-800 text-gray-500 hover:bg-zinc-800')}>JUAL</button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input type="number" value={orderForm.amount} onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })} placeholder="Masukkan Jumlah USDT" required className="w-full rounded-xl border border-gray-800 bg-black px-4 py-4 font-mono text-white focus:border-blue-500 outline-none text-lg" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">USDT</span>
                </div>
                <div className="relative">
                  <input type="number" value={orderForm.price} disabled className="w-full rounded-xl border border-gray-800 bg-zinc-800/50 px-4 py-4 font-mono text-gray-400" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">IDR</span>
                </div>
              </div>

              {orderForm.amount && orderForm.price && (
                <div className="rounded-xl bg-zinc-800/50 p-5 border border-gray-800 animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-gray-500 font-bold uppercase">Total Pembayaran (Est. IDR)</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">{formatIDR(parseFloat(orderForm.amount) * parseFloat(orderForm.price))}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!account || isProcessing} 
                className={"flex w-full items-center justify-center gap-3 rounded-xl px-4 py-5 font-black text-lg transition-all active:scale-[0.98] " + 
                  (account && !isProcessing ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/20" : "bg-gray-800 text-gray-500 cursor-not-allowed")
                }
              >
                <ArrowRightLeft className={`h-6 w-6 ${isProcessing ? 'animate-spin' : ''}`} />
                {isProcessing ? "MEMPROSES..." : "EKSEKUSI TRANSAKSI"}
              </button>
              
              {account && !CHAINS[Number(chainId)] && (
                <p className="text-center text-xs text-red-500 font-bold">⚠️ Harap pindah ke jaringan BSC atau Polygon di MetaMask.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelliTradePage;
