import { cookies } from "next/headers";

export function setCookie(name, value, options = {}) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use secure cookies in production
    sameSite: "strict",
    path: "/", // cookie available across the site
    ...options,
  };
  cookies().set(name, value, cookieOptions);
}

export function getCookie(name) {
  const cookie = cookies().get(name);
  return cookie?.value || null;
}
