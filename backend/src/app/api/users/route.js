import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: {
        userName: data.userName,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          status: false,
          message: "User with this username or email already exists.",
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create the new user
    const newUser = await prisma.adminUser.create({
      data: {
        userType: data.userType,
        userName: data.userName,
        password: hashedPassword,
      },
    });

    // Remove password from the response
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        status: true,
        message: "User has been created successfully!",
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.adminUser.findMany();
    return NextResponse.json({ status: true, data: users });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Something Went Wrong.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
