import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.toLowerCase();

  try {
    console.log("GET /api/orders - Address filter:", address);
    const orders = await db.order.findMany({
      where: address ? { targetAddress: address } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST /api/orders - Request body:", body);

    // Bypass check: create dummy order to test DB
    const order = await db.order.create({
      data: {
        targetAddress: (body.targetAddress || "0x0").toLowerCase(),
        asset: body.asset || "TEST",
        amount: (body.amount || "0").toString(),
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
    console.error("CRITICAL DB ERROR:", error);
    return NextResponse.json({ 
        error: "Database connection failed", 
        details: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
    try {
      const body = await request.json();
      console.log("PATCH /api/orders - Updating order:", body.id);

      const order = await db.order.update({
        where: { id: body.id },
        data: {
          status: body.status,
          txHash: body.txHash,
        },
      });
      return NextResponse.json(order);
    } catch (error: any) {
      console.error("PATCH /api/orders error:", error);
      return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
    }
}
