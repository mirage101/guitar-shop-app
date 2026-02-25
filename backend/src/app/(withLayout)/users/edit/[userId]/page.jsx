import { getUserById } from "@/app/actions/userActions";
import EditUser from "@/screens/admin/users/edit";

const EditUserPage = async ({ params, searchParams }) => {
  const user = await getUserById(params.userId);
  return <EditUser user={user} searchParams={searchParams} />;
};

export default EditUserPage;
