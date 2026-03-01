import { NextResponse } from "next/server";
import { deleteCookie } from "./app/actions/authActions";
import { verifyJWT } from "./lib/utils";

const allowedOrigins = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:19006",
  "http://127.0.0.1:19006",
];

export default async function handler(req) {
  const { pathname } = req.nextUrl;
  const requestOrigin = req.headers.get("origin") || "";
  const isAllowedOrigin = allowedOrigins.includes(requestOrigin);

  if (pathname.startsWith("/api")) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": isAllowedOrigin
        ? requestOrigin
        : allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
    };

    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const token = req?.cookies?.get("jwt_token")?.value;
  const publicRoutes = ["/login"];
  const isValidToken = await verifyJWT(token);
  if (!isValidToken && !publicRoutes.includes(req.nextUrl.pathname)) {
    deleteCookie("jwt_token");
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (isValidToken && publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
