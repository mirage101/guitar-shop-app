"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtTokenVerification } from "./authActions";

export async function createProductType(formData) {
  await jwtTokenVerification();
  const data = {
    name: formData.get("name"),
  };
  const existingProductType = await prisma.productType.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingProductType) {
    return redirect(
      `/product-type/add?errorMessage=Product Type already exists. Please try with different product type.`
    );
  }
  await prisma.productType.create({
    data: {
      name: data.name,
    },
  });
  revalidatePath("/product-type", "page");
  redirect("/product-type");
}

export async function getProductTypes() {
  await jwtTokenVerification();
  const productTypes = await prisma.productType.findMany();
  return productTypes;
}

export async function deleteProductType(id) {
  await jwtTokenVerification();
  await prisma.productType.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/product-type", "page");
}

export async function getProductTypeById(id) {
  await jwtTokenVerification();
  const productType = await prisma.productType.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return productType;
}

export async function updateProductType(formData, id) {
  await jwtTokenVerification();
  const data = {
    name: formData.get("name"),
  };
  const existingProductType = await prisma.productType.findUnique({
    where: {
      name: data.name,
    },
  });
  if (existingProductType) {
    return redirect(
      `/product-type/edit/${id}?errorMessage=Product Type already exists. Please try with different product type.`
    );
  }
  await prisma.productType.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: data.name,
    },
  });
  revalidatePath("/product-type", "page");
  redirect("/product-type");
}
