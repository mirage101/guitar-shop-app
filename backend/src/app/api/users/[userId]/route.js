import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Product type ID is required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Product type not found.",
        },
        { status: 404 }
      );
    }
    const response = {
      id: user.id,
      userName: user.userName,
      userType: user.userType,
    };
    return NextResponse.json({
      data: response,
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

export async function PUT(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const data = await request.json();
    let hashedPassword;
    // Validate the request body
    await schema.validate(data);

    if (data.password) {
      hashedPassword = hashPassword(data.password);
    }
    const updatedUser = await prisma.adminUser.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        userType: data.userType,
        userName: data.userName,
        ...(data.password && { password: hashedPassword }),
      },
    });
    return NextResponse.json({
      message: "User updated successfully",
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

export async function DELETE(request, { params }) {
  try {
    const userId = parseInt(params.userId);
    const deletedUser = await prisma.adminUser.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json({
      message: "User deleted successfully",
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
