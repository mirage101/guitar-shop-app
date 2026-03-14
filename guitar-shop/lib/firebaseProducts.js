import { collection, getDocs, getDocsFromServer } from "firebase/firestore";
import { db } from "./firebase";

const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url || "");
const imageBaseUrl = (process.env.EXPO_PUBLIC_IMAGE_BASE_URL || "").replace(/\/+$/, "");

const normalizeRelativePath = (value) => {
  if (!value) {
    return "";
  }

  return value.startsWith("/") ? value : `/${value}`;
};

const resolveProductImageUrl = (rawProduct = {}) => {
  const candidateImage =
    rawProduct.imageUrl ||
    rawProduct.imageURL ||
    rawProduct.image;

  if (!candidateImage) {
    return "";
  }

  if (isAbsoluteUrl(candidateImage)) {
    return candidateImage;
  }

  if (candidateImage.startsWith("gs://")) {
    return candidateImage;
  }

  if (imageBaseUrl) {
    return `${imageBaseUrl}${normalizeRelativePath(candidateImage)}`;
  }

  return candidateImage;
};

const normalizeProduct = (rawProduct = {}, documentId) => {
  const productId = rawProduct.id ?? documentId;
  const resolvedImageUrl = resolveProductImageUrl(rawProduct);
  const normalizedProductType = rawProduct.productType
    ? rawProduct.productType
    : rawProduct.productTypeName
      ? {
          id: rawProduct.productTypeId ?? rawProduct.productTypeName,
          name: rawProduct.productTypeName,
        }
      : rawProduct.productTypeId
        ? {
            id: rawProduct.productTypeId,
            name: String(rawProduct.productTypeId),
          }
        : null;

  return {
    ...rawProduct,
    id: productId,
    image: resolvedImageUrl,
    mrp: Number(rawProduct.mrp ?? 0),
    sellPrice: Number(rawProduct.sellPrice ?? 0),
    currentStock: Number(rawProduct.currentStock ?? 0),
    rating: Number(rawProduct.rating ?? 0),
    productTypeId: rawProduct.productTypeId ?? normalizedProductType?.id,
    productType: normalizedProductType,
  };
};

const fetchAllProducts = async ({ forceServer = false } = {}) => {
  const productsCollection = collection(db, "products");
  const snapshot = forceServer
    ? await getDocsFromServer(productsCollection)
    : await getDocs(productsCollection);
  const products = snapshot.docs.map((productDoc) => normalizeProduct(productDoc.data(), productDoc.id));

  return products.filter((product) => product.isActive !== false);
};

const findProductById = async (targetId) => {
  const normalizedTargetId = String(targetId);
  const allProducts = await fetchAllProducts();
  return allProducts.find((product) => String(product.id) === normalizedTargetId) || null;
};

const fetchProductTypeOptions = async () => {
  const products = await fetchAllProducts();

  const typeMap = new Map();

  products.forEach((product) => {
    const typeId = product?.productType?.id ?? product?.productTypeId;
    const typeName = product?.productType?.name;

    if (!typeId || !typeName) {
      return;
    }

    typeMap.set(String(typeId), {
      value: String(typeId),
      label: typeName,
    });
  });

  return [{ value: "all", label: "All" }, ...Array.from(typeMap.values())];
};

export { fetchAllProducts, fetchProductTypeOptions, findProductById };
