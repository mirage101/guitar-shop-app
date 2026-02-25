import Sidebar from "@/components/Sidebar";
import { getUserData } from "../actions/authActions";
export default async function RootLayout({ children }) {
  const userData = await getUserData();
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar userData={userData} />
      </div>
      <div className="col-span-10 rounded-xl border-1 shadow-lg border-gray-300 p-6 my-6 mr-8">
        {children}
      </div>
    </div>
  );
}
