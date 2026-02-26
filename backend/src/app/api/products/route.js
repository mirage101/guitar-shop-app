import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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

export async function POST(request) {
  try {
    const data = await request.json();

    // Check if the product type exists
    const productType = await prisma.productType.findUnique({
      where: { id: data.productTypeId },
    });

    if (!productType) {
      return jsonResponse(
        { status: false, message: "Product Type not found." },
        { status: 404 }
      );
    }

    // Create the new product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        mrp: data.mrp,
        sellPrice: data.sellPrice,
        image: data.image,
        productTypeId: data.productTypeId,
        size: data.size,
        currentStock: data.currentStock,
        rating: data.rating,
        isActive: data.isActive,
      },
    });

    return jsonResponse(
      {
        status: true,
        message: "Product has been created!",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonResponse(
      {
        status: false,
        message: "Something Went Wrong.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      productTypeId: searchParams.get("productTypeId"),
      sortBy: searchParams.get("sortBy"),
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      rating: searchParams.get("rating")
        ? Number(searchParams.get("rating"))
        : undefined,
      inStock: searchParams.get("inStock")
        ? searchParams.get("inStock")
        : undefined,
      search: searchParams.get("search"),
    };
    console.log("🚀 ~ GET ~ filters:", filters)

    const whereClause = {
      ...(filters.search
        ? {
          name: {
            contains: filters.search.toLowerCase(),
          },
        }
        : {}),
      ...(filters.productTypeId
        ? {
          productTypeId: Number(filters.productTypeId),
        }
        : {}),
      ...(filters.minPrice || filters.maxPrice
        ? {
          sellPrice: {
            gte: filters.minPrice || undefined,
            lte: filters.maxPrice || undefined,
          },
        }
        : {}),
      ...(filters.rating !== undefined
        ? {
          rating: filters.rating,
        }
        : {}),
      ...(filters.inStock === "true"
        ? { currentStock: { gt: 0 } }
        : filters.inStock === "false"
          ? { currentStock: 0 }
          : {}),
    };

    // Get products
    const products = await prisma.product.findMany({
      include: {
        productType: true,
      },
      where: { ...whereClause, isActive: true },
      orderBy: {
        sellPrice:
          filters.sortBy === "sellPrice"
            ? "asc"
            : filters.sortBy === "-sellPrice"
              ? "desc"
              : undefined,
      },
    });

    return jsonResponse({ status: true, data: products });
  } catch (error) {
    return jsonResponse(
      {
        status: false,
        message: "Something Went Wrong.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
