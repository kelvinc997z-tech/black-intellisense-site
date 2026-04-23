import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.toLowerCase();

  try {
    const orders = await db.order.findMany({
      where: address ? { targetAddress: address } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await db.order.create({
      data: {
        targetAddress: body.targetAddress.toLowerCase(),
        asset: body.asset,
        amount: body.amount.toString(),
        price: body.price,
        side: body.side,
        chainId: body.chainId,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
    try {
      const body = await request.json();
      const order = await db.order.update({
        where: { id: body.id },
        data: {
          status: body.status,
          txHash: body.txHash,
        },
      });
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
