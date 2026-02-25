import { prisma } from "@/lib/prisma";
import { jwtTokenVerification } from "./authActions";

export async function getBuyers() {
  await jwtTokenVerification();
  const buyers = await prisma.buyerMaster.findMany({
    where: {
      salesMasters: {
        some: {},
      },
    },
  });
  return buyers;
}
