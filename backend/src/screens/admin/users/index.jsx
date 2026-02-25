"use client";
import { deleteUser } from "@/app/actions/userActions";
import { EditIcon, TrashIcon } from "@/app/icons";
import Button from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import { useState } from "react";

const Users = ({ users }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const handleDelete = async () => {
    await deleteUser(selectedId);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="title-text"> Admin Users </h1>
        <Link href="/users/add" className="custom-button">
          Add User
        </Link>
      </div>
      <div className="mt-20">
        <table className="custom-table">
          <thead className="text-gray-600 text-lg">
            <tr>
              <th>Sr. No.</th>
              <th>User Name </th>
              <th>User Type </th>
              <th>Action </th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-medium text-lg text-start">
            {users?.length > 0 ? (
              users?.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.userName}</td>
                  <td>{user.userType}</td>
                  <td className="flex items-center gap-x-3">
                    <Link href={`/users/edit/${user.id}`} className="w-fit">
                      <EditIcon className="text-gray-500" />
                    </Link>
                    <Button
                      className="bg-transparent p-0 border-none text-red-500"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedId(user.id);
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="!text-center">
                  No Data Found.
                </td>
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
          message="Are you sure you want to delete this user?"
        />
      )}
    </>
  );
};

export default Users;
