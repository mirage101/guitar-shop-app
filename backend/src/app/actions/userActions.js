"use server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtTokenVerification } from "./authActions";

export async function createUser(formData) {
  await jwtTokenVerification();
  const data = {
    userName: formData.get("userName"),
    userType: formData.get("userType"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Check if the user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: {
      userName: data.userName,
    },
  });

  if (existingUser) {
    return redirect(
      `/users/add?errorMessage=Username already exists. Please try with different username.`
    );
  }

  // Hash the password
  const hashedPassword = await hashPassword(data.password);

  // Create the new user
  await prisma.adminUser.create({
    data: {
      userType: data.userType,
      userName: data.userName,
      password: hashedPassword,
    },
  });
  revalidatePath("/users", "page");
  redirect("/users");
}

export async function getUsers() {
  await jwtTokenVerification();
  const users = await prisma.adminUser.findMany();
  return users;
}

export async function deleteUser(id) {
  await jwtTokenVerification();
  await prisma.adminUser.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/users", "page");
}

export async function getUserById(id) {
  await jwtTokenVerification();
  const user = await prisma.adminUser.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return user;
}

export async function updateUser(formData, userId) {
  await jwtTokenVerification();
  const data = {
    userName: formData.get("userName"),
    userType: formData.get("userType"),
    password: formData.get("password"),
  };
  const existingUser = await prisma.adminUser.findUnique({
    where: {
      userName: data.userName,
    },
  });
  if (existingUser) {
    return redirect(
      `/users/edit/${userId}?errorMessage=Username already exists. Please try with different username.`
    );
  }
  let hashedPassword;
  if (data.password) {
    hashedPassword = await hashPassword(data.password);
  }
  await prisma.adminUser.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      userType: data.userType,
      userName: data.userName,
      ...(data.password && { password: hashedPassword }),
    },
  });
  revalidatePath("/users", "page");
  redirect("/users");
}
