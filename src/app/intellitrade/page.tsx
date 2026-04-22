"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const IntelliTradePage = () => {
  const [bestPrice, setBestPrice] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    symbol: 'USDT',
    side: 'buy' as 'buy' | 'sell',
    amount: '',
    price: ''
  });

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [orderForm.side]);

  const fetchPrice = async () => {
    const mockPrice = orderForm.side === 'buy' ? 1.0002 : 0.9998;
    setBestPrice({ best_price: mockPrice });
    setOrderForm(prev => ({ ...prev, price: mockPrice.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = "Order OTC " + orderForm.side.toUpperCase() + " senilai " + orderForm.amount + " USDT berhasil!";
    toast.success(message);
    setOrderForm({ ...orderForm, amount: '' });
  };

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            IntelliTrade OTC Platform
          </h1>
          <p className="mt-2 text-base text-gray-500">Trading OTC profesional dengan harga live</p>
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Rate Saat Ini</p>
                  <p className="mt-4 font-mono text-6xl font-bold text-blue-400">
                    {bestPrice.best_price}
                  </p>
                  <p className="mt-4 font-mono text-sm text-gray-600">USD per USDT</p>
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
                  <label className="mb-2 block text-sm font-medium text-gray-400">Harga (USD)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                    required
                    className="w-full rounded-xl border border-gray-800 bg-black px-4 py-4 font-mono text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {orderForm.amount && orderForm.price && (
                <div className="rounded-xl bg-zinc-800/50 p-5 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Estimasi</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-white">
                    {formatCurrency(parseFloat(orderForm.amount) * parseFloat(orderForm.price), 'USD')}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-5 font-bold text-white shadow-xl shadow-blue-500/20 hover:from-blue-700 hover:to-cyan-700 transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="h-6 w-6" />
                KONFIRMASI TRANSAKSI
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelliTradePage;
