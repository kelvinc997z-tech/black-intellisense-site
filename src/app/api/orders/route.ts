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

    const order = await db.order.create({
      data: {
        targetAddress: body.targetAddress.toLowerCase(),
        asset: body.asset,
        amount: body.amount.toString(),
        price: parseFloat(body.price),
        side: body.side,
        chainId: body.chainId || 56,
        status: "pending"
      },
    });
    
    console.log("POST /api/orders - Success:", order);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("POST /api/orders - Critical error:", error);
    return NextResponse.json({ 
        error: error.message || "Failed to create order",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
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
