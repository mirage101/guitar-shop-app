const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");
const admin = require("firebase-admin");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

function getFirebaseCredential() {
  const serviceAccountFile = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountFile) {
    const filePath = path.resolve(process.cwd(), serviceAccountFile);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return admin.credential.cert(JSON.parse(fileContent));
  }

  if (serviceAccountJson) {
    return admin.credential.cert(JSON.parse(serviceAccountJson));
  }

  return admin.credential.applicationDefault();
}

function initFirebaseAdmin() {
  const credential = getFirebaseCredential();
  const projectId = process.env.FIREBASE_PROJECT_ID;

  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential,
        ...(projectId ? { projectId } : {}),
      });

  return admin.firestore(app);
}

async function migrateProducts() {
  const firestore = initFirebaseAdmin();

  const products = await prisma.product.findMany({
    include: {
      productType: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!products.length) {
    console.log("No products found in Prisma database.");
    return;
  }

  console.log(`Preparing to migrate ${products.length} products to Firestore...`);

  const batches = [];
  let batch = firestore.batch();
  let operationCount = 0;

  for (const product of products) {
    const documentRef = firestore.collection("products").doc(String(product.id));

    const payload = {
      id: product.id,
      name: product.name,
      description: product.description,
      mrp: product.mrp,
      sellPrice: product.sellPrice,
      image: product.image,
      productTypeId: product.productTypeId,
      productTypeName: product.productType?.name || null,
      productType: product.productType
        ? {
            id: product.productType.id,
            name: product.productType.name,
          }
        : null,
      currentStock: product.currentStock,
      rating: product.rating || 0,
      smallSize: product.smallSize,
      mediumSize: product.mediumSize,
      largeSize: product.largeSize,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    batch.set(documentRef, payload, { merge: true });
    operationCount += 1;

    if (operationCount === 400) {
      batches.push(batch.commit());
      batch = firestore.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    batches.push(batch.commit());
  }

  await Promise.all(batches);
  console.log(`Migration completed. ${products.length} products upserted into Firestore.`);
}

migrateProducts()
  .catch((error) => {
    console.error("Product migration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
