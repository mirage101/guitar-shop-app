"use server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { jwtTokenVerification } from "./authActions";

const UPLOAD_DIR = path.resolve("public/uploads");

export async function handleDeleteImage(imagePath) {
  if (imagePath) {
    const existingImageFullPath = path.join(process.cwd(), "public", imagePath);
    // Check if the file exists
    if (fs.existsSync(existingImageFullPath)) {
      // Delete the file
      fs.unlinkSync(existingImageFullPath);
    }
  }
}

export async function createProduct(formData) {
  await jwtTokenVerification();
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    sellPrice: formData.get("sellPrice"),
    mrp: formData.get("mrp"),
    smallSize: formData.get("smallSize"),
    mediumSize: formData.get("mediumSize"),
    largeSize: formData.get("largeSize"),
    productTypeId: formData.get("productType"),
    isActive: formData.get("isActive"),
  };

  // Check if the product type exists
  const productType = await prisma.productType.findUnique({
    where: { id: parseInt(data.productTypeId) },
  });
  if (!productType) {
    return redirect(
      `/product/add?errorMessage=Product Type not found. Please try with different product type.`
    );
  }

  const file = formData.get("image");
  let imagePath = "";

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // create the directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    // Generate a unique filename
    const filename = Date.now() + path.extname(file.name);
    imagePath = `/uploads/${filename}`;

    // Save the file
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await writeFile(fullPath, buffer);
  }

  const totalStock =
    parseInt(data.smallSize) +
    parseInt(data.mediumSize) +
    parseInt(data.largeSize);

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      sellPrice: parseFloat(data.sellPrice),
      mrp: parseFloat(data.mrp),
      image: imagePath,
      currentStock: totalStock,
      productTypeId: parseInt(data.productTypeId),
      isActive: data.isActive === "on" ? true : false,
      smallSize: parseInt(data.smallSize),
      mediumSize: parseInt(data.mediumSize),
      largeSize: parseInt(data.largeSize),
    },
  });
  revalidatePath("/products", "page");
  redirect("/products");
}

export async function getProducts() {
  await jwtTokenVerification();
  const products = await prisma.product.findMany({
    include: { productType: true },
  });
  return products;
}

export async function getProductById(id) {
  await jwtTokenVerification();
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  return product;
}
export async function deleteProduct(product) {
  await jwtTokenVerification();
  await handleDeleteImage(product.image);
  await prisma.product.delete({ where: { id: parseInt(product.id) } });
  revalidatePath("/products", "page");
}

export async function updateProduct(formData, productId, existingImage) {
  await jwtTokenVerification();
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
    sellPrice: formData.get("sellPrice"),
    mrp: formData.get("mrp"),
    smallSize: formData.get("smallSize"),
    mediumSize: formData.get("mediumSize"),
    largeSize: formData.get("largeSize"),
    productTypeId: formData.get("productType"),
    isActive: formData.get("isActive"),
  };

  const file = formData.get("image");
  let imagePath = existingImage;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // delete existing image
    await handleDeleteImage(existingImage);
    const filename = Date.now() + path.extname(file.name);
    imagePath = `/uploads/${filename}`;

    // Save the file
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await writeFile(fullPath, buffer);
  }

  const totalStock =
    parseInt(data.smallSize) +
    parseInt(data.mediumSize) +
    parseInt(data.largeSize);

  await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      name: data.name,
      description: data.description,
      sellPrice: parseFloat(data.sellPrice),
      mrp: parseFloat(data.mrp),
      image: imagePath,
      currentStock: totalStock,
      productTypeId: parseInt(data.productTypeId),
      isActive: data.isActive === "on" ? true : false,
      smallSize: parseInt(data.smallSize),
      mediumSize: parseInt(data.mediumSize),
      largeSize: parseInt(data.largeSize),
    },
  });
  revalidatePath("/products", "page");
  redirect("/products");
}
