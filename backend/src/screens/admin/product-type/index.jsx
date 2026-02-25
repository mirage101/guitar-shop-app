"use client";
import { deleteProductType } from "@/app/actions/productTypeActions";
import { EditIcon, TrashIcon } from "@/app/icons";
import Button from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import { useState } from "react";

const ProductType = ({ productTypes }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const handleDelete = async () => {
    await deleteProductType(selectedId);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="title-text"> Product Types </h1>
        <Link href="/product-type/add" className="custom-button">
          Add Product Type
        </Link>
      </div>
      <div className="mt-20">
        <table className="custom-table">
          <thead className="text-gray-600 text-lg">
            <tr>
              <th>Sr. No.</th>
              <th>Product Type </th>
              <th>Action </th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-medium text-lg">
            {productTypes.length > 0 ? (
              productTypes.map((productType, index) => (
                <tr key={productType.id}>
                  <td>{index + 1}</td>
                  <td>{productType.name}</td>
                  <td className="flex items-center gap-x-3">
                    <Link
                      href={`/product-type/edit/${productType.id}`}
                      className="w-fit"
                    >
                      <EditIcon className="text-gray-500" />
                    </Link>
                    <Button
                      className="bg-transparent p-0 border-none text-red-500"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedId(productType.id);
                      }}
                    >
                      <TrashIcon />
                    </Button>
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
          message="Are you sure you want to delete this product type?"
        />
      )}
    </>
  );
};

export default ProductType;
