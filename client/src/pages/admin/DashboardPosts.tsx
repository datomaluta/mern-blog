import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getPosts } from "../../services/post";
import { useState } from "react";
import { Pagination, Table } from "flowbite-react";
import { PostType } from "../../types/post";
import { textTrimmer } from "../../helpers/stringFunctions";
import LoadingSpinner from "../../components/sharedComponents/LoadingSpinner";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoAddCircleSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import ModalWrapper from "../../components/ui/ModalWrapper";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const DashboardPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [chosenItem, setChosenItem] = useState({} as PostType);
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () =>
      getPosts({
        page: currentPage,
        queryString:
          currentUser?.role === "user" ? `user=${currentUser._id}` : "",
      }).then((res) => res?.data?.data),
  });

  const onPageChange = (page: number) => setCurrentPage(page);

  const { mutate: deleteMutation, isPending: isDeletingLoading } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setTimeout(() => {
        toast.success("Post deleted successfully");
        setDeleteModalIsOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["posts", currentPage],
        });
      }, 200);
    },
    onError: () => {
      toast.error("Something went wrong with delete!");
    },
  });

  return (
    <div>
      <AnimatePresence>
        {deleteModalIsOpen && (
          <ModalWrapper setModalIsVisible={setDeleteModalIsOpen}>
            <h3 className="text-center mt-10">
              Are you sure you want to delete this post?
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
      <div className="flex justify-between mb-5 items-center">
        <h1 className="text-lg font-medium">Posts</h1>
        <Link
          to={"/dashboard/posts/create"}
          className="bg-light-purple text-white px-3 py-1 rounded-md font-medium flex items-center gap-2"
        >
          <IoAddCircleSharp className="text-xl" /> Add Post
        </Link>
      </div>
      {postsLoading && <LoadingSpinner blur />}

      {postsData?.posts?.length === 0 && (
        <h1 className="text-xl font-medium text-center mt-4">No posts found</h1>
      )}

      {postsData?.posts?.length ? (
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {postsData?.posts?.map((post: PostType, index: number) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>{textTrimmer(post.title, 30)}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell className="flex gap-3">
                    <Link
                      to={`/dashboard/posts/edit/${post?._id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 border border-cyan-600 p-2 rounded-full"
                    >
                      <MdEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setChosenItem(post);
                        setDeleteModalIsOpen(true);
                      }}
                      className="text-red-700 font-medium border border-red-700 p-2 rounded-full"
                    >
                      <FaTrashAlt />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        ""
      )}

      {Math.ceil(postsData?.total / 9) > 1 ? (
        <Pagination
          layout="pagination"
          currentPage={currentPage}
          totalPages={Math.ceil(postsData?.total / 9) || 1}
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

export default DashboardPosts;
