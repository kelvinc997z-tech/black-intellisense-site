"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Hook sederhana untuk menangani koneksi MetaMask & Sign-In (Message Signing)
 */
export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectAndSign = async () => {
    setError(null);
    
    // 1. Cek apakah MetaMask terinstal
    if (!window.ethereum) {
      setError("MetaMask tidak terdeteksi. Silakan instal extension MetaMask.");
      return;
    }

    try {
      setIsSigning(true);

      // 2. Request akses akun
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // 3. Buat pesan untuk di-sign (mencegah replay attacks)
      const message = `Selamat datang di Black Intellisense!\n\nKlik Sign untuk masuk.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      
      // 4. Minta user melakukan Sign Message
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      console.log("Signature berhasil:", signature);
      
      // Di tahap ini, Anda biasanya mengirim `address`, `message`, dan `signature` 
      // ke backend Anda untuk diverifikasi dan membuat session/JWT.
      
      setAccount(address);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menghubungkan dompet.");
    } finally {
      setIsSigning(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  return { account, isSigning, error, connectAndSign, disconnect };
};

export default function Web3SignIn() {
  const { account, isSigning, error, connectAndSign, disconnect } = useMetaMask();

  return (
    <div className="p-6 border border-gray-800 rounded-2xl bg-zinc-900/50 backdrop-blur-md max-w-md">
      <h2 className="text-xl font-bold mb-4 text-white">Web3 Authentication</h2>
      
      {account ? (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-400 font-mono break-all">
              Connected: {account}
            </p>
          </div>
          <button 
            onClick={disconnect}
            className="w-full py-2 text-sm font-medium text-gray-400 hover:text-white transition"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectAndSign}
          disabled={isSigning}
          className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
        >
          {isSigning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menunggu Signature...
            </>
          ) : (
            "Connect MetaMask"
          )}
        </button>
      )}

      {error && (
        <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
