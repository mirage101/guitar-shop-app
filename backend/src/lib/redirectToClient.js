"use client";
import { useRouter } from "next/navigation";
export const RedirectToClient = (url) => {
  const router = useRouter();
  return router.push(url);
};
