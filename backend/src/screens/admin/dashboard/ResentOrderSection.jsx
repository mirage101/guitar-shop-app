"use client";
import { formatDate } from "@/app/actions/dashboardActions";
import { InformationIcon } from "@/app/icons";
import ProductsRenderModal from "@/components/ProductsRenderModal";
import Button from "@/components/ui/Button";
import { useState } from "react";

const ResentOrderSection = ({ orders }) => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  return (
    <>
      <div className="grid dashboard-card">
        <h1 className="text-2xl font-bold"> Recent Orders </h1>
        <table className="custom-table">
          <thead className="text-gray-600 text-lg">
            <tr>
              <th>Sr. No.</th>
              <th>Buyer's Name </th>
              <th>Date </th>
              <th>Total </th>
              <th>Payment Mode </th>
              <th>Products </th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-medium text-lg text-start">
            {orders?.length > 0 ? (
              orders?.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order?.buyer?.customerName}</td>
                  <td>{formatDate(order.SODateTime)}</td>
                  <td>${order.grandTotalPrice}</td>
                  <td>{order.paymentMode}</td>
                  <td>
                    <Button
                      type="button"
                      className="bg-transparent text-blue-700 p-0"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsProductModalOpen(true);
                      }}
                    >
                      <InformationIcon />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="!text-center">
                  No Orders Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isProductModalOpen && (
        <ProductsRenderModal
          setIsOpen={setIsProductModalOpen}
          products={selectedOrder?.salesTransactions}
        />
      )}
    </>
  );
};

export default ResentOrderSection;
