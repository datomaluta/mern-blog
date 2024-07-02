import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoAddCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../services/user";
import { UserType } from "../../types/user";
import LoadingSpinner from "../../components/sharedComponents/LoadingSpinner";
import { useState } from "react";
import { Pagination } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import ModalWrapper from "../../components/ui/ModalWrapper";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [chosenItem, setChosenItem] = useState({} as UserType);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () =>
      getAllUsers({ page: currentPage })?.then((res) => res.data?.data),
  });

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { mutate: deleteMutation, isPending: isDeletingLoading } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setTimeout(() => {
        toast.success("User deleted successfully");
        setDeleteModalIsOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["users", currentPage],
        });
      }, 200);
    },
  });

  return (
    <div>
      <AnimatePresence>
        {deleteModalIsOpen && (
          <ModalWrapper setModalIsVisible={setDeleteModalIsOpen}>
            <h3 className="text-center mt-10">
              Are you sure you want to delete this user?
            </h3>
            <div className="mt-auto flex gap-4 justify-around">
              <button
                onClick={() => deleteMutation(chosenItem?._id)}
                className="bg-light-purple px-4 py-1 rounded-lg"
              >
                {isDeletingLoading ? <LoadingSpinner /> : "Yes"}
              </button>
              <button className="">No</button>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Users</h1>
        <Link
          to={"/dashboard/users/create"}
          className="bg-light-purple text-white px-3 py-1 rounded-md font-medium flex items-center gap-2"
        >
          <IoAddCircleSharp className="text-xl" /> Add User
        </Link>
      </div>

      {usersLoading && <LoadingSpinner blur />}

      {usersData?.users?.length === 0 && (
        <h1 className="text-xl font-medium text-center mt-4">No posts found</h1>
      )}

      {usersData?.users?.length ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg rounded-lg overflow-hidden z-10">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData?.users?.map((user: UserType, index: number) => (
                <tr
                  key={index}
                  className="bg-white border-b last:border-none dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user?.photo}
                      alt="user image"
                    />
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        {user?.username}
                      </div>
                      <div className="font-normal text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{user?.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          user?.active ? "bg-green-500" : "bg-red-500"
                        } me-2`}
                      ></div>
                      {user?.active ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Link
                      to={`/dashboard/users/edit/${user?._id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 border border-cyan-600 p-2 rounded-full"
                    >
                      <MdEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setChosenItem(user);
                        setDeleteModalIsOpen(true);
                      }}
                      className="text-red-700 font-medium border border-red-700 p-2 rounded-full"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      {Math.ceil(usersData?.total / 9) > 1 ? (
        <Pagination
          layout="pagination"
          currentPage={currentPage}
          totalPages={Math.ceil(usersData?.total / 9) || 1}
          onPageChange={onPageChange}
          previousLabel=""
          nextLabel=""
          showIcons
          className="mt-8"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Users;
