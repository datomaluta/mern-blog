import { useQuery } from "react-query";
import { getPosts } from "../services/post";
import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
import { motion } from "framer-motion";
import { formatDate } from "../helpers/dateFunctions";
import { Link } from "react-router-dom";

type User = {
  email: string;
  id: string;
  imageUrl: string;
  photo: string;
  role: string;
  username: string;
  _id: string;
};

type PostType = {
  category: string;
  content: string;
  createdAt: string;
  id: string;
  image: string;
  imageUrl: string;
  slug: string;
  title: string;
  updatedAt: string;
  user: User;
};
const Home = () => {
  const { data: posts, isLoading: postsLoading } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: () => getPosts().then((res) => res.data?.data?.posts),
  });

  console.log(posts);
  console.log(postsLoading);

  return (
    <div className="mt-10 pb-40 min-h-screen">
      {postsLoading && <LoadingSpinner blur />}

      {!postsLoading && !posts?.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-2xl font-bold">No posts found</h1>
        </motion.div>
      )}

      {!postsLoading && posts?.length && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-20 sm:mb-0"
          >
            <div className="relative">
              <div className="bg-red-500 rounded-xl overflow-hidden">
                <img
                  className="w-full object-cover max-h-[37.5rem]"
                  src={posts[0]?.imageUrl || ""}
                  alt={posts[0]?.title || ""}
                />
              </div>
              <div className="dark:bg-dark-gray-shade bg-white shadow-lg w-[37.5rem] lg:w-[28rempx] md:w-[25rem] absolute -bottom-[64px] left-[5%] rounded-xl p-10 lg:p-6 md:p-4 sm:relative sm:-bottom-0 sm:left-0 sm:w-[90%] sm:mx-auto sm:p-4 sm:h-auto sm:mt-4  sm:shadow-all-sides sm:-translate-y-[5rem]">
                <p className="bg-light-purple w-max px-3 py-1 rounded-md text-sm md:text-xs text-white">
                  {posts[0]?.category}
                </p>
                <h1 className="text-4xl font-semibold mt-4 lg:text-2xl md:text-xl sm:text-lg md:mt-3 line-clamp-3">
                  The Impact of Technology on the Workplace: How Technology is
                  Changing
                </h1>

                <div className="flex items-center dark:text-zinc-500 text-zinc-400 mt-6 md:mt-3 lg:text-sm">
                  <div className="w-9 md:w-7 h-9 md:h-7 rounded-full overflow-hidden object-cover mr-2 sm:mr-1">
                    <img
                      className="w-full h-full"
                      src={posts[0]?.user?.imageUrl}
                      alt="avatar"
                    />
                  </div>
                  <p className="mr-4 sm:mr-2">Jason Francisco</p>
                  <p>{formatDate(posts[0]?.createdAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <>
            {" "}
            <h2 className="mt-36 sm:mt-4 text-2xl font-semibold mb-8">
              Latest posts
            </h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
              {posts?.map((post: PostType) => (
                <div
                  key={post.id}
                  className="p-4 border dark:border-dark-gray-tint border-white-shade rounded-xl flex flex-col"
                >
                  <div className="object-cover rounded-xl overflow-hidden max-w-[360px] h-[50%] lg:max-w-full mb-4">
                    <img
                      className="w-full h-full object-cover"
                      src={post.imageUrl}
                      alt={post.title}
                    />
                  </div>

                  <p className="dark:bg-light-purple bg-white-shade dark:bg-opacity-10 bg-opacity-70 mb-4 w-max px-3 py-1 rounded-md text-sm md:text-xs text-light-purple">
                    {post.category}
                  </p>

                  <h1 className="text-2xl sm:text-lg font-semibold line-clamp-3 mb-4">
                    {post.title}
                  </h1>

                  <div className="flex items-center dark:text-zinc-500 text-zinc-400 lg:text-sm mt-auto ">
                    <div className="w-9 md:w-7 h-9 md:h-7 rounded-full overflow-hidden object-cover mr-2 sm:mr-1">
                      <img
                        className="w-full h-full"
                        src={post?.user?.imageUrl}
                        alt="avatar"
                      />
                    </div>
                    <p className="mr-4 sm:mr-2">Jason Francisco</p>
                    <p>{formatDate(post?.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              className="mt-8 block text-center border border-white-shade dark:border-dark-gray-tint w-max mx-auto px-5 py-3 rounded-xl"
              to={"/"}
            >
              View all posts
            </Link>
          </>
        </>
      )}
    </div>
  );
};

export default Home;
