import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const productId = params.productId;

    const product = await prisma.product.findUnique({
      include: {
        productType: true,
      },
      where: {
        id: parseInt(productId),
        isActive: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something Went Wrong.",
        error,
      },
      { status: 500 }
    );
  }
}
