import { prisma } from "@/lib/prisma";
import { createJWT, hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const name = data?.name?.trim();
    const email = data?.email?.trim()?.toLowerCase();
    const password = data?.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.buyerMaster.findUnique({
      where: {
        email,
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
    const hashedPassword = await hashPassword(password);
    // Create the new user
    const newUser = await prisma.buyerMaster.create({
      data: {
        customerName: name,
        email,
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
