const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toInt(value, fallback = 0) {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

async function resolveProductTypeId(productTypeName) {
  const normalizedName = String(productTypeName || "").trim();

  if (!normalizedName) {
    throw new Error("productType is required for each product.");
  }

  const productType = await prisma.productType.upsert({
    where: { name: normalizedName },
    update: {},
    create: { name: normalizedName },
    select: { id: true },
  });

  return productType.id;
}

const cliArgs = process.argv.slice(2);
const shouldUpsert = cliArgs.includes("--upsert");
const jsonPathArg = cliArgs.find((arg) => !arg.startsWith("--"));

async function importProducts(jsonPath) {
  const absolutePath = path.resolve(process.cwd(), jsonPath || "scripts/products.sample.json");

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Input file not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Input JSON must be a non-empty array of products.");
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const [index, item] of parsed.entries()) {
    const name = String(item.name || "").trim();
    const description = String(item.description || "").trim();
    const image = String(item.image || "").trim();
    const sellPrice = toNumber(item.sellPrice, NaN);
    const mrp = item.mrp === undefined ? sellPrice : toNumber(item.mrp, NaN);

    if (!name || !description || !image) {
      throw new Error(`Product at index ${index} is missing required fields: name, description, image.`);
    }

    if (!Number.isFinite(sellPrice)) {
      throw new Error(`Product at index ${index} must have a valid sellPrice.`);
    }

    if (!Number.isFinite(mrp)) {
      throw new Error(`Product at index ${index} has invalid mrp.`);
    }

    const productTypeId = await resolveProductTypeId(item.productType);

    const payload = {
      name,
      description,
      mrp,
      sellPrice,
      image,
      productTypeId,
      currentStock: toInt(item.currentStock, 0),
      rating: toNumber(item.rating, 0),
      isActive: item.isActive !== false,
    };

    if (shouldUpsert) {
      const existingProduct = await prisma.product.findFirst({
        where: { name },
        select: { id: true },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: payload,
        });
        updatedCount += 1;
      } else {
        await prisma.product.create({ data: payload });
        createdCount += 1;
      }
    } else {
      await prisma.product.create({ data: payload });
      createdCount += 1;
    }
  }

  if (shouldUpsert) {
    console.log(`Processed ${parsed.length} products from ${absolutePath} (created: ${createdCount}, updated: ${updatedCount})`);
  } else {
    console.log(`Imported ${createdCount} products from ${absolutePath}`);
  }
}

importProducts(jsonPathArg)
  .catch((error) => {
    console.error("Bulk product import failed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
