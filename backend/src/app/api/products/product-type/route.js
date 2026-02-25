import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany();
    return NextResponse.json({ status: true, data: productTypes });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Something Went Wrong.",
        error,
      },
      { status: 500 }
    );
  }
}
