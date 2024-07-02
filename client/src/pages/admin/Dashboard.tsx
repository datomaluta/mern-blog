import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaNewspaper, FaRegCommentDots, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/user";
import { getPosts } from "../../services/post";
import { getAllComments } from "../../services/comments";
import LoadingSpinner from "../../components/sharedComponents/LoadingSpinner";

const Dashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers({ page: 1 })?.then((res) => res.data?.data),
    enabled: currentUser?.role === "admin",
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      getPosts({
        page: 1,
        queryString:
          currentUser?.role === "user" ? `user=${currentUser._id}` : "",
      }).then((res) => res?.data?.data),
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getAllComments({ page: 1 })?.then((res) => res.data?.data),
    enabled: currentUser?.role === "admin",
  });

  return (
    <div>
      <h1 className="text-lg mb-4 font-medium">
        Hello {currentUser?.username}
      </h1>

      {(commentsLoading || usersLoading || postsLoading) && (
        <LoadingSpinner blur />
      )}

      <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
        {currentUser?.role === "admin" && (
          <div className="dark:bg-dark-gray-tint bg-white-shade p-4 rounded-lg flex flex-col">
            <div className="flex justify-between">
              <p className="text-lg font-medium">Total Users</p>
              <span className="bg-dark-gray p-2 rounded-full ">
                <FaUsers className="w-5 h-5 text-white" />
              </span>
            </div>
            <p className="text-2xl font-bold">{usersData?.total}</p>

            <Link
              to={"/dashboard/users"}
              className="text-sky-500 mt-6 inline-block ml-auto"
            >
              View all
            </Link>
          </div>
        )}

        <div className="dark:bg-dark-gray-tint bg-white-shade p-4 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <p className="text-lg font-medium">Total Posts</p>
            <span className="bg-dark-gray p-2 rounded-full">
              <FaNewspaper className="w-5 h-5 text-white" />
            </span>
          </div>
          <p className="text-2xl font-bold">
            {currentUser?.role === "admin"
              ? postsData?.total
              : postsData?.posts?.length}
          </p>

          <Link
            to={"/dashboard/posts"}
            className="text-sky-500 mt-6 inline-block ml-auto"
          >
            View all
          </Link>
        </div>

        {currentUser?.role === "admin" && (
          <div className="dark:bg-dark-gray-tint bg-white-shade p-4 rounded-lg flex flex-col">
            <div className="flex justify-between">
              <p className="text-lg font-medium">Total Comments</p>
              <span className="bg-dark-gray p-2 rounded-full">
                <FaRegCommentDots className="h-5 w-5 text-white" />
              </span>
            </div>
            <p className="text-2xl font-bold">{commentsData?.total}</p>

            <Link
              to={"/dashboard/comments"}
              className="text-sky-500 mt-6 inline-block ml-auto"
            >
              View all
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
