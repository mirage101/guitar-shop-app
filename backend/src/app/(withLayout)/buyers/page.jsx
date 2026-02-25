import { getBuyers } from "@/app/actions/buyerActions";
import Buyers from "@/screens/admin/buyers";

const BuyersPage = async () => {
  const buyers = await getBuyers();
  return <Buyers buyers={buyers} />;
};

export default BuyersPage;
