import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/post";
import { useState } from "react";
import { Pagination, Table } from "flowbite-react";
import { PostType } from "../../types/post";
import { textTrimmer } from "../../helpers/stringFunctions";
import LoadingSpinner from "../../components/sharedComponents/LoadingSpinner";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoAddCircleSharp } from "react-icons/io5";

const DashboardPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () =>
      getPosts({ page: currentPage }).then((res) => res?.data?.data),
  });

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-lg font-medium">Posts</h1>
        <Link
          to={""}
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
                      to="#"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 border border-cyan-600 p-2 rounded-full"
                    >
                      <MdEdit />
                    </Link>
                    <button className="text-red-700 font-medium border border-red-700 p-2 rounded-full">
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

      {postsData?.posts?.length ? (
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
