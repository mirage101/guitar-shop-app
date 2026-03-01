import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 5;
    const skip = (safePage - 1) * safeLimit;

    const cookieToken = request?.cookies?.get("customer_jwt_token")?.value;
    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = cookieToken || bearerToken;

    const decodedToken = await verifyJWT(token);

    if (!decodedToken) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const buyerId = decodedToken?.id;

    if (!buyerId) {
      return NextResponse.json(
        { message: "Invalid user details for orders." },
        { status: 400 }
      );
    }

    const where = {
      bId: parseInt(buyerId),
    };

    const totalItems = await prisma.salesMaster.count({
      where,
    });

    const orders = await prisma.salesMaster.findMany({
      where: {
        bId: parseInt(buyerId),
      },
      include: {
        salesTransactions: true,
      },
      orderBy: {
        SODateTime: "desc",
      },
      skip,
      take: safeLimit,
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));

    return NextResponse.json({
      status: true,
      data: orders,
      meta: {
        page: safePage,
        limit: safeLimit,
        totalItems,
        totalPages,
      },
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
