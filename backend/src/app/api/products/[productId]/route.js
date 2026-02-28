import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const jsonResponse = (body, init = {}) =>
  NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

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
