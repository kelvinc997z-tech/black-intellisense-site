"use client";

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, LogOut } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Komponen Sign-In MetaMask untuk Navbar
 */
export default function Web3SignIn() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectAndSignIn = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask tidak terdeteksi!");
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // Sign message untuk autentikasi
      const signer = await provider.getSigner();
      const message = `Sign-in ke Black Intellisense\nTimestamp: ${Date.now()}`;
      await signer.signMessage(message);
      
      setAccount(address);
      toast.success("Berhasil Masuk!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal Login");
    } finally {
      setIsConnecting(false);
    }
  };

  if (account) {
    return (
      <div className="flex items-center gap-3 bg-white/5 border border-emerald-500/30 rounded-full px-4 py-1.5 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black text-emerald-400 font-mono">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <button 
          onClick={() => setAccount(null)} 
          className="text-white/20 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectAndSignIn}
      disabled={isConnecting}
      className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-orange-600 hover:border-orange-500 transition-all duration-500 shadow-xl"
    >
      <Wallet className={`h-3 w-3 ${isConnecting ? 'animate-spin' : 'text-orange-500 group-hover:text-white'}`} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
        {isConnecting ? "Signing..." : "Web3 Sign In"}
      </span>
    </button>
  );
}
