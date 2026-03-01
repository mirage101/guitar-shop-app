import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
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

    if (!Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json(
        { message: "No products provided for checkout." },
        { status: 400 }
      );
    }

    const buyerEmail = decodedToken?.email || data.customerEmail;
    const buyerId = decodedToken?.id || data.customerId;

    if (!buyerEmail || !buyerId) {
      return NextResponse.json(
        { message: "Invalid user details for checkout." },
        { status: 400 }
      );
    }

    await prisma.buyerMaster.update({
      where: {
        email: buyerEmail,
      },
      data: {
        address: data.address,
        city: data.city,
      },
    });

    const validSizeKeys = ["smallSize", "mediumSize", "largeSize"];

    for (const product of data.products) {
      const productId = parseInt(product.id);
      const quantity = Number(product.quantity || 0);

      if (!productId || quantity <= 0) {
        return NextResponse.json(
          { message: "Invalid product details in cart." },
          { status: 400 }
        );
      }

      const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!currentProduct) {
        return NextResponse.json(
          { message: `Product not found: ${productId}` },
          { status: 404 }
        );
      }

      if (currentProduct.currentStock < quantity) {
        return NextResponse.json(
          {
            message: `${currentProduct.name} has only ${currentProduct.currentStock} items left in stock.`,
          },
          { status: 400 }
        );
      }

      const updateData = {
        currentStock: currentProduct.currentStock - quantity,
      };

      if (product.size && validSizeKeys.includes(product.size)) {
        const currentSizeStock = Number(currentProduct[product.size] || 0);

        if (currentSizeStock < quantity) {
          return NextResponse.json(
            {
              message: `${currentProduct.name} has only ${currentSizeStock} items left for selected size.`,
            },
            { status: 400 }
          );
        }

        updateData[product.size] = currentSizeStock - quantity;
      }

      await prisma.product.update({
        where: { id: productId },
        data: updateData,
      });
    }

    const SODateTime = new Date(data.SODateTime * 1000);
    const salesData = await prisma.salesMaster.create({
      data: {
        bId: parseInt(buyerId),
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
