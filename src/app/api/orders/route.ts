import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.toLowerCase();

  try {
    // Jika ada filter address, tampilkan hanya untuk client tersebut.
    // Jika tidak ada (dipanggil oleh Admin Control Panel), tampilkan SEMUA transaksi global.
    const orders = await db.order.findMany({
      where: address ? { targetAddress: address } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi data minimal
    if (!body.targetAddress || !body.amount || !body.asset) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        targetAddress: body.targetAddress.toLowerCase(),
        asset: body.asset,
        amount: body.amount.toString(),
        price: parseFloat(body.price || 0),
        side: body.side || "buy",
        chainId: parseInt(body.chainId || 56),
        status: body.status || "pending",
        paymentHash: body.paymentHash || null,
        txHash: body.txHash || null
      },
    });
    
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Database save failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Admin merubah status (approved / rejected)
      const order = await db.order.update({
        where: { id: body.id },
        data: {
          status: body.status, // 'approved' atau 'rejected'
          txHash: body.txHash || undefined,
        },
      });
      return NextResponse.json(order);
    } catch (error: any) {
      console.error("PATCH /api/orders error:", error);
      return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
    }
}
