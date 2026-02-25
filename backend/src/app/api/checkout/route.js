import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const token = request?.cookies?.get("customer_jwt_token")?.value;

    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await prisma.buyerMaster.update({
      where: {
        email: data.customerEmail,
      },
      data: {
        address: data.address,
        city: data.city,
      },
    });
    for (const product of data.products) {
      const currentProduct = await prisma.product.findUnique({
        where: { id: parseInt(product.id) },
      });
      const newSizeQuantity = currentProduct?.[product.size] - product.quantity;
      const newCurrentStock = currentProduct?.currentStock - product.quantity;
      // Update the product with the new size quantity
      await prisma.product.update({
        where: { id: product.id },
        data: {
          [product.size]: newSizeQuantity,
          currentStock: newCurrentStock,
        },
      });
    }

    const SODateTime = new Date(data.SODateTime * 1000);
    const salesData = await prisma.salesMaster.create({
      data: {
        bId: parseInt(data.customerId),
        SODateTime: SODateTime,
        grandTotalPrice: data.grandTotalPrice,
        paymentMode: data.paymentMode,
      },
    });

    for (const product of data.products) {
      await prisma.salesTransaction.create({
        data: {
          SMOId: salesData.id,
          productId: parseInt(product.id),
          productName: product.name,
          unitPrice: product.sellPrice,
          qtyPurchased: product.quantity,
          total: product.quantity * product.sellPrice,
        },
      });
    }

    return NextResponse.json({ message: "Order placed successfully." });
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
