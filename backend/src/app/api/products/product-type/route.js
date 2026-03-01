import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const jsonResponse = (body, init = {}) =>
  NextResponse.json(body, {
    ...init,
    headers: init.headers || {},
  });

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
