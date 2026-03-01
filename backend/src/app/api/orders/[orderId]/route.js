import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const cookieToken = request?.cookies?.get("customer_jwt_token")?.value;
    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = cookieToken || bearerToken;

    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const buyerId = decodedToken?.id;
    const orderId = params?.orderId;

    if (!buyerId || !orderId) {
      return NextResponse.json(
        { message: "Invalid order details." },
        { status: 400 }
      );
    }

    const order = await prisma.salesMaster.findFirst({
      where: {
        id: orderId,
        bId: parseInt(buyerId),
      },
      include: {
        salesTransactions: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.salesTransaction.deleteMany({
        where: {
          SMOId: orderId,
        },
      });

      await tx.salesMaster.delete({
        where: {
          id: orderId,
        },
      });
    });

    return NextResponse.json({ message: "Order removed successfully." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
