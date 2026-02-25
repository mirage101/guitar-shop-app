import { prisma } from "@/lib/prisma";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "2-digit" };
  return date.toLocaleDateString("en-GB", options);
};
export async function getDashboardData() {
  const customersData = await prisma.buyerMaster.findMany({
    include: {
      salesMasters: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const salesMastersData = await prisma.salesMaster.findMany({
    include: {
      buyer: true,
      salesTransactions: true,
    },
    orderBy: {
      SODateTime: "asc",
    },
  });

  const salesByDate = salesMastersData.reduce((acc, sale) => {
    const date = formatDate(sale.SODateTime);

    if (!acc[date]) {
      acc[date] = {
        date,
        sales: 0,
      };
    }

    acc[date].sales += sale.grandTotalPrice;

    return acc;
  }, {});

  const customersByDate = customersData.reduce((acc, customer) => {
    const date = formatDate(customer.createdAt);

    if (!acc[date]) {
      acc[date] = {
        date,
        count: 0,
      };
    }

    acc[date].count += 1;

    return acc;
  }, {});

  const totalBuyers = customersData?.filter(
    (buyer) => buyer.salesMasters?.length > 0
  )?.length;
  const totalRevenue = salesMastersData.reduce(
    (acc, sale) => acc + sale.grandTotalPrice,
    0
  );
  const dashboardData = {
    totalBuyers,
    totalCustomers: customersData.length,
    orders: salesMastersData?.reverse()?.splice(0, 5),
    salesChartData: Object.values(salesByDate),
    customerChartData: Object.values(customersByDate),
    totalRevenue,
  };
  return dashboardData;
}
