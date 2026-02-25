import { getUsers } from "@/app/actions/userActions";
import Users from "@/screens/admin/users";

export default async function UserManagement() {
  const users = await getUsers();
  return <Users users={users} />;
}
