"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const IntelliTradePage = () => {
  const [bestPrice, setBestPrice] = useState<any>(null);
  const [rateIDR, setRateIDR] = useState<number>(16000);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderForm, setOrderForm] = useState({
    symbol: 'USDT',
    side: 'buy' as 'buy' | 'sell',
    amount: '',
    price: ''
  });

  // Fetch Live USD/IDR rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data.rates && data.rates.IDR) {
          setRateIDR(data.rates.IDR);
        }
      } catch (err) {
        console.error("Failed to fetch IDR rate", err);
      }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [orderForm.side, rateIDR]);

  const fetchPrice = async () => {
    // Basic spreads based on USD/IDR live rate
    const basePrice = rateIDR;
    const mockPrice = orderForm.side === 'buy' ? basePrice + 15 : basePrice - 15;
    setBestPrice({ best_price: mockPrice });
    setOrderForm(prev => ({ ...prev, price: mockPrice.toFixed(2) }));
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask tidak terdeteksi!");
      return;
    }
    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      
      const message = "Sign-in to IntelliTrade OTC\nTimestamp: " + Date.now();
      const signer = await provider.getSigner();
      await signer.signMessage(message);
      
      setAccount(address);
      toast.success("Wallet berhasil terhubung!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghubungkan wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return toast.error("Hubungkan wallet terlebih dahulu!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const totalIDR = parseFloat(orderForm.amount) * parseFloat(orderForm.price);
      
      // Request Digital Signature as "Approval" for the OTC Order
      const message = "KONFIRMASI ORDER OTC\n\n" +
                      "Tipe: " + orderForm.side.toUpperCase() + "\n" +
                      "Jumlah: " + orderForm.amount + " USDT\n" +
                      "Rate: Rp " + orderForm.price + "\n" +
                      "Total: Rp " + totalIDR.toLocaleString('id-ID') + "\n\n" +
                      "Dengan menandatangani ini, Anda menyetujui transaksi OTC di atas.";

      const signature = await signer.signMessage(message);
      console.log("Transaction Approved with Signature:", signature);

      toast.success("Transaksi Berhasil Di-approve!");
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err: any) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error("Transaksi Ditolak oleh User.");
      } else {
        toast.error("Gagal memproses transaksi.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              IntelliTrade OTC Platform
            </h1>
            <p className="mt-2 text-base text-gray-500">Trading OTC profesional dengan harga live</p>
          </div>
          
          <div>
            {account ? (
              <div className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all shadow-lg shadow-orange-900/20"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Live Pricing Card */}
          <div className="rounded-2xl border border-gray-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Harga OTC Live</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-gray-500">Live Feed</span>
              </div>
            </div>

            {bestPrice && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-blue-500/5 p-12 text-center border border-blue-500/20">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Rate USDT/IDR (Live)</p>
                  <p className="mt-4 font-mono text-6xl font-bold text-blue-400">
                    {bestPrice.best_price.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-4 font-mono text-sm text-gray-600">Rupiah per USDT</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Form Card */}
          <div className="rounded-2xl border border-gray-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
            <h3 className="mb-6 text-xl font-semibold text-white">Eksekusi Order</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-400">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, side: 'buy' })}
                    className={
                      "rounded-xl py-3 font-bold transition-all " +
                      (orderForm.side === 'buy'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'border border-gray-800 text-gray-500 hover:bg-zinc-800')
                    }
                  >
                    BELI
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, side: 'sell' })}
                    className={
                      "rounded-xl py-3 font-bold transition-all " +
                      (orderForm.side === 'sell'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                        : 'border border-gray-800 text-gray-500 hover:bg-zinc-800')
                    }
                  >
                    JUAL
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">Jumlah (USDT)</label>
                  <input
                    type="number"
                    value={orderForm.amount}
                    onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                    placeholder="0.00"
                    required
                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-4 font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-400">Harga per USDT (IDR)</label>
                  <input
                    type="number"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                    required
                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-4 font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {orderForm.amount && orderForm.price && (
                <div className="rounded-xl bg-zinc-800/50 p-5 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Estimasi (Rupiah)</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">
                    {formatIDR(parseFloat(orderForm.amount) * parseFloat(orderForm.price))}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!account || isProcessing}
                className={"flex w-full items-center justify-center gap-3 rounded-xl px-4 py-5 font-bold text-white shadow-xl transition-all active:scale-[0.98] " + 
                  (account && !isProcessing
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/20 hover:from-blue-700 hover:to-cyan-700" 
                    : "bg-gray-800 text-gray-500 cursor-not-allowed")
                }
              >
                <ShoppingCart className="h-6 w-6" />
                {isProcessing ? "MENUNGGU APPROVAL..." : (account ? "KONFIRMASI TRANSAKSI" : "HUBUNGKAN WALLET UNTUK TRANSAKSI")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelliTradePage;
