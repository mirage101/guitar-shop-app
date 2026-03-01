import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const jsonResponse = (body, init = {}) =>
  NextResponse.json(body, {
    ...init,
    headers: init.headers || {},
  });

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
      return jsonResponse(
        {
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return jsonResponse({
      data: product,
    });
  } catch (error) {
    return jsonResponse(
      {
        message: "Something Went Wrong.",
        error,
      },
      { status: 500 }
    );
  }
}
