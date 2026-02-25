import Dashboard from "@/screens/admin/dashboard";
import { getDashboardData } from "../actions/dashboardActions";

export default async function App() {
  const dashboardData = await getDashboardData();
  return <Dashboard dashboardData={dashboardData} />;
}
