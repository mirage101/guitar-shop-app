"use client";
import { logoutUser } from "@/app/actions/authActions";
import {
  HomeIcon,
  LogoutIcon,
  ShoppingBag,
  TagIcon,
  UsersIcon,
} from "@/app/icons";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";

export default function Sidebar({ userData }) {
  const menuItems = [
    { text: "Dashboard", url: "/", icon: <HomeIcon /> },
    { text: "Users", url: "/users", icon: <UsersIcon /> },
    { text: "Product Type", url: "/product-type", icon: <TagIcon /> },
    { text: "Products", url: "/products", icon: <ShoppingBag /> },
    { text: "Buyers", url: "/buyers", icon: <UsersIcon /> },
  ];

  return (
    <div className="sidebar-main">
      <div className="p-4 m-4">
        <h1 className="text-3xl font-semibold"> MyStore </h1>
      </div>

      <ul className="sidebar-list-container">
        {menuItems.map((item, key) => {
          return (
            <Link href={item.url}>
              <div className="sidebar-list-item flex">
                <span className="mx-2">{item.icon}</span>
                {item.text}
              </div>
            </Link>
          );
        })}
      </ul>

      <div className="fixed bottom-0 w-60 my-4 m-2 rounded-3xl border-t-2 border-gray-300 hover:bg-blue-100 hover:border-blue-200">
        <div className="flex flex-row m-3 mb-8 items-center">
          <Image
            alt="next logo"
            height={40}
            radius="sm"
            className="border-gray-600 rounded-full border-2"
            src={"/user.svg"}
            width={40}
          />
          <div className="m-auto text-lg">{userData.userName} </div>
          <Button
            className="bg-transparent text-black p-0"
            onClick={() => logoutUser()}
          >
            <LogoutIcon className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
