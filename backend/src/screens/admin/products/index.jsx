"use client";
import { deleteProduct } from "@/app/actions/productActions";
import { EditIcon, TrashIcon } from "@/app/icons";
import Button from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Products = ({ products }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

  const handleDelete = async () => {
    await deleteProduct(selectedProduct);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="title-text"> Product Types </h1>
        <Link href="/products/add" className="custom-button">
          Add Product
        </Link>
      </div>
      <div className="mt-10 max-h-[calc(100vh-200px)] overflow-auto">
        <table className="custom-table">
          <thead className="text-gray-600 text-lg sticky top-0">
            <tr>
              <th>Product</th>
              <th>Product Type </th>
              <th>MRP </th>
              <th>Selling Price </th>
              <th>Current Stock </th>
              <th>Status </th>
              <th>Action </th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-medium text-lg">
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td className="grid grid-cols-[auto_1fr] gap-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex flex-col self-center">
                      <span>{product.name}</span>
                      <span className="text-sm text-gray-500 truncate max-w-52">
                        {product.description}
                      </span>
                    </div>
                  </td>
                  <td>{product.productType.name || "-"}</td>
                  <td>${product.mrp || "0"}</td>
                  <td>${product.sellPrice || "0"}</td>
                  <td>{product.currentStock || "0"}</td>
                  <td
                    className={cn(
                      product.isActive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className="flex self-center gap-x-3">
                      <Link
                        href={`/products/edit/${product.id}`}
                        className="w-fit"
                      >
                        <EditIcon className="text-gray-500" />
                      </Link>
                      <Button
                        className="bg-transparent p-0 border-none text-red-500"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedProduct(product);
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No Data Found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          setIsOpen={setIsDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this product?"
        />
      )}
    </>
  );
};

export default Products;
