"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  ShoppingCart, Wallet, ArrowRightLeft, ShieldCheck, Zap, Info, 
  Activity, Cpu, Terminal, Radio, Database, BarChart3, ScanFace, 
  FileDown, LayoutGrid, ListFilter, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

// CONSTANTS
const DEALER_WALLET = "0xE0BE7181C05023999c1e15b5a1Eb89147DcEB334";
const CHAINS: Record<number, { name: string; usdt: string; explorer: string }> = {
  56: { name: 'BSC', usdt: '0x55d398326f99059fF775485246999027B3197955', explorer: 'https://bscscan.com/tx/' },
  137: { name: 'Polygon', usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', explorer: 'https://polygonscan.com/tx/' }
};
const ASSETS = [
  { id: 'USDT', name: 'Tether USD' },
  { id: 'BNB', name: 'Binance Coin' },
  { id: 'USDC', name: 'USD Coin' }
];

const IntelliTradePage = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState({ side: 'buy', amount: '', asset: 'USDT' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple connect
  const connect = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  // DIRECT EXECUTION - NO EXTRA DELAYS
  const handleAction = async () => {
    if (!account) return alert("Connect Wallet First");
    if (!orderForm.amount) return alert("Enter Amount");

    setIsProcessing(true);
    const tId = toast.loading("Processing...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      let tx;
      if (orderForm.asset === 'BNB') {
        // Native Transfer
        tx = await signer.sendTransaction({
          to: DEALER_WALLET,
          value: ethers.parseEther(orderForm.amount)
        });
      } else {
        // Token Transfer
        const config = CHAINS[chainId];
        if (!config) throw new Error("Switch to BSC or Polygon");
        
        const contract = new ethers.Contract(
          config.usdt, 
          ["function transfer(address to, uint256 amount) public returns (bool)"], 
          signer
        );
        const decimals = chainId === 137 ? 6 : 18;
        tx = await contract.transfer(DEALER_WALLET, ethers.parseUnits(orderForm.amount, decimals));
      }

      toast.loading("Confirming on Blockchain...", { id: tId });
      await tx.wait();
      toast.success("Transaction Successful!", { id: tId });
      setOrderForm({ ...orderForm, amount: '' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.reason || err.message || "Failed", { id: tId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center border-b border-white/5 pb-8">
          <h1 className="text-3xl font-black italic tracking-tighter">INTELLITRADE <span className="text-blue-500">V.6</span></h1>
          <button onClick={connect} className="px-6 py-2 bg-blue-600 rounded-full font-bold text-xs">
            {account ? `${account.slice(0,6)}...` : "CONNECT WALLET"}
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-bold mb-6">Market</h3>
            <div className="space-y-4">
              {ASSETS.map(a => (
                <button key={a.id} onClick={() => setOrderForm({...orderForm, asset: a.id})} className={`w-full p-4 rounded-xl border transition-all text-left ${orderForm.asset === a.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5'}`}>
                  {a.name} ({a.id})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex bg-black/50 p-1 rounded-xl mb-8">
              <button onClick={() => setOrderForm({...orderForm, side: 'buy'})} className={`flex-1 py-3 rounded-lg font-bold text-xs ${orderForm.side === 'buy' ? 'bg-blue-600' : 'text-zinc-500'}`}>BUY</button>
              <button onClick={() => setOrderForm({...orderForm, side: 'sell'})} className={`flex-1 py-3 rounded-lg font-bold text-xs ${orderForm.side === 'sell' ? 'bg-zinc-700' : 'text-zinc-500'}`}>SELL</button>
            </div>

            <div className="space-y-6">
              <input 
                type="number" 
                value={orderForm.amount} 
                onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})} 
                placeholder="0.00" 
                className="w-full bg-black border border-white/10 p-6 rounded-2xl text-2xl font-bold outline-none focus:border-blue-500"
              />
              
              <button 
                onClick={handleAction}
                disabled={isProcessing}
                className="w-full py-6 bg-white text-black rounded-2xl font-black text-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
              >
                {isProcessing ? "WAITING..." : `CONFIRM ${orderForm.side.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelliTradePage;
