const Buyers = ({ buyers }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="title-text"> Buyers </h1>
      </div>
      <div className="mt-20">
        <table className="custom-table">
          <thead className="text-gray-600 text-lg">
            <tr>
              <th>Sr. No.</th>
              <th>Name </th>
              <th>Email </th>
              <th>Address </th>
              <th>City </th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-medium text-lg text-start">
            {buyers?.length > 0 ? (
              buyers?.map((buyer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{buyer.customerName}</td>
                  <td>{buyer.email}</td>
                  <td>{buyer.address}</td>
                  <td>{buyer.city}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="!text-center">
                  No Buyers Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Buyers;
