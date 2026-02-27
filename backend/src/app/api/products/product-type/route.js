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

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany();
    return jsonResponse({ status: true, data: productTypes });
  } catch (error) {
    return jsonResponse(
      {
        status: false,
        message: "Something Went Wrong.",
        error,
      },
      { status: 500 }
    );
  }
}
