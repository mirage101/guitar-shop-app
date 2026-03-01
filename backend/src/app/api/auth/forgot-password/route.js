import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const email = data?.email?.trim()?.toLowerCase();
    const newPassword = data?.newPassword;

    if (!email || !newPassword) {
      return NextResponse.json(
        {
          message: "Email and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.buyerMaster.findUnique({
      where: {
        email,
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

    const hashedPassword = await hashPassword(newPassword);

    await prisma.buyerMaster.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Password updated successfully.",
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
