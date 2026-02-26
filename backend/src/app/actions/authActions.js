"use server";
import { getCookie, setCookie } from "@/lib/cookies";
import { prisma } from "@/lib/prisma";
import { createJWT, verifyJWT, verifyPassword } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteCookie(name) {
  const cookieStore = cookies();
  cookieStore.delete(name);
}
export async function loginUser(formData) {
  const data = {
    userName: formData.get("userName"),
    password: formData.get("password"),
  };

  const user = await prisma.adminUser.findUnique({
    where: { userName: data.userName },
  });

  if (!user) {
    return redirect(
      `/login?errorMessage=Invalid credentials. Please try again.`
    );
  }

  const isValidPassword = await verifyPassword(data.password, user.password);

  if (!isValidPassword) {
    return redirect(
      `/login?errorMessage=Invalid credentials. Please try again.`
    );
  }

  const token = await createJWT(user);

  setCookie("jwt_token", token, { maxAge: 2 * 60 * 60 }); // 2 hours
  redirect("/");
}

export async function jwtTokenVerification() {
  const token = getCookie("jwt_token");

  const tokenData = await verifyJWT(token);

  if (!tokenData) {
    return redirect("/login");
  }

  return tokenData;
}

export async function getUserData() {
  const decodedToken = await jwtTokenVerification();
  const userData = await prisma.adminUser.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!userData) {
    return redirect("/login?errorMessage=Session expired. Please login again.");
  }

  return userData;
}

export async function logoutUser() {
  deleteCookie("jwt_token");
  redirect("/login");
}
