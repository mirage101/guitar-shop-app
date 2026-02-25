import { CloseIcon } from "@/app/icons";

const ProductsRenderModal = ({ setIsOpen, products }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
        <div className="relative text-center bg-white rounded-lg shadow-lg p-5">
          <button
            type="button"
            className="close-icon-button"
            onClick={closeModal}
          >
            <CloseIcon />
            <span className="sr-only">Close modal</span>
          </button>
          <div>
            <table className="custom-table mt-5">
              <thead className="text-gray-600 text-lg">
                <tr>
                  <th>Sr. No.</th>
                  <th>Product Name </th>
                  <th>Selling Price </th>
                  <th>Purchased Quantity </th>
                  <th>Total Amount </th>
                </tr>
              </thead>
              <tbody className="text-gray-500 font-medium text-lg text-start">
                {products?.map((buyer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{buyer.productName}</td>
                    <td>${buyer.unitPrice}</td>
                    <td>{buyer.qtyPurchased}</td>
                    <td>${buyer.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsRenderModal;
