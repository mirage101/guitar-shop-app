// get product type by id

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const productTypeId = params.productTypeId;

    if (!productTypeId) {
      return NextResponse.json(
        {
          message: "Product type ID is required.",
        },
        { status: 400 }
      );
    }

    const productType = await prisma.productType.findUnique({
      where: {
        id: parseInt(productTypeId),
      },
    });

    if (!productType) {
      return NextResponse.json(
        {
          message: "Product type not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: productType,
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
    const productTypeId = params.id;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    const updatedProductType = await prisma.productType.update({
      where: {
        id: parseInt(productTypeId),
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json({
      data: updatedProductType,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong while updating the product type.",
        error,
      },
      { status: 500 }
    );
  }
}
