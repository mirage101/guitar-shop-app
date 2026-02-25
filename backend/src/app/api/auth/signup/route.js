import { prisma } from "@/lib/prisma";
import { createJWT, hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const existingCustomer = await prisma.buyerMaster.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          message: "User with this email already exists.",
        },
        { status: 409 }
      );
    }
    // Hash the password
    const hashedPassword = await hashPassword(data.password);
    // Create the new user
    const newUser = await prisma.buyerMaster.create({
      data: {
        customerName: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = await createJWT(newUser);

    return NextResponse.json({
      message: "User created successfully",
      data: newUser,
      token,
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
