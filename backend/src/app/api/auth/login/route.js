import { prisma } from "@/lib/prisma";
import { createJWT, verifyPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const existingCustomer = await prisma.buyerMaster.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!existingCustomer) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }
    const isValidPassword = await verifyPassword(
      data.password,
      existingCustomer.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Invalid credentials. Please try again.",
        },
        { status: 401 }
      );
    }
    const token = await createJWT(existingCustomer);

    return NextResponse.json({
      message: "Login successful.",
      token,
      data: existingCustomer,
    });
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
