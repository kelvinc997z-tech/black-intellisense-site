import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

// NOTE: In production, VAULT_PRIVATE_KEY should be stored in Vercel Environment Variables (.env)
// Never hardcode private keys in the codebase.
const VAULT_PRIVATE_KEY = process.env.VAULT_PRIVATE_KEY;
const VAULT_ADDRESS = "0xE0BE7181C05023999c1e15b5a1Eb89147DcEB334";

const RPC_URLS: Record<number, string> = {
  56: "https://bsc-dataseed.binance.org/",
  137: "https://polygon-rpc.com"
};

const USDT_ADDRESSES: Record<number, string> = {
  56: "0x55d398326f99059fF775485246999027B3197955",
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
};

export async function POST(request: NextRequest) {
  try {
    const { side, targetAddress, asset, amount, chainId, paymentHash } = await request.json();

    if (side !== 'buy') {
      return NextResponse.json({ error: "Invalid side for this endpoint" }, { status: 400 });
    }

    if (!VAULT_PRIVATE_KEY) {
      // For development/demo if key is missing, return a simulated success
      console.warn("VAULT_PRIVATE_KEY missing. Simulating success for demo.");
      return NextResponse.json({ 
        success: true, 
        hash: "0x" + Math.random().toString(16).slice(2, 66),
        message: "SIMULATED: Vault private key not set in environment."
      });
    }

    const rpcUrl = RPC_URLS[chainId];
    if (!rpcUrl) return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Optional: Verify paymentHash on-chain before releasing funds
    if (paymentHash) {
        const receipt = await provider.getTransactionReceipt(paymentHash);
        if (!receipt || receipt.status !== 1) {
            return NextResponse.json({ error: "Payment transaction not confirmed or failed" }, { status: 400 });
        }
    }

    const wallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);

    let tx;
    if (asset === 'BNB' || asset === 'POL') {
      tx = await wallet.sendTransaction({
        to: targetAddress,
        value: ethers.parseEther(amount.toString())
      });
    } else {
      const usdtAddress = USDT_ADDRESSES[chainId];
      const contract = new ethers.Contract(usdtAddress, [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function decimals() view returns (uint8)"
      ], wallet);
      
      let decimals = 18;
      try { decimals = await contract.decimals(); } catch (e) { decimals = chainId === 137 ? 6 : 18; }
      
      tx = await contract.transfer(targetAddress, ethers.parseUnits(amount.toString(), decimals));
    }

    return NextResponse.json({ 
      success: true, 
      hash: tx.hash 
    });

  } catch (error: any) {
    console.error("Vault Execution Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
