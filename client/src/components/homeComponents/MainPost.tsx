import { motion } from "framer-motion";
import { formatDate } from "../../helpers/dateFunctions";
import { PostType } from "../../types/post";
import { Link } from "react-router-dom";

const MainPost = ({ post }: { post: PostType }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-20 sm:mb-0 group"
    >
      <Link to={`/posts/${post?.slug}`}>
        <div className="relative">
          <div className="bg-red-500 rounded-xl overflow-hidden">
            <img
              className="w-full object-cover max-h-[37.5rem]"
              src={post?.image || ""}
              alt={post?.title || ""}
            />
          </div>
          <div className="dark:bg-dark-gray-shade bg-white shadow-lg w-[37.5rem] lg:w-[28rempx] md:w-[25rem] absolute -bottom-[64px] left-[5%] rounded-xl p-10 lg:p-6 md:p-4 sm:relative sm:-bottom-0 sm:left-0 sm:w-[90%] sm:mx-auto sm:p-4 sm:h-auto sm:mt-4  sm:shadow-all-sides sm:-translate-y-[5rem] group-hover:-translate-y-4 transition-all duration-300">
            <p className="bg-light-purple w-max px-3 py-1 rounded-md text-sm md:text-xs text-white">
              {post?.category}
            </p>
            <h1 className="text-4xl font-semibold mt-4 lg:text-2xl md:text-xl sm:text-lg md:mt-3 line-clamp-3">
              {post.title}
            </h1>

            <div className="flex items-center dark:text-zinc-500 text-zinc-400 mt-6 md:mt-3 lg:text-sm">
              <div className="w-9 md:w-7 h-9 md:h-7 rounded-full overflow-hidden object-cover mr-2 sm:mr-1">
                <img
                  className="w-full h-full"
                  src={post?.user?.photo}
                  alt="avatar"
                />
              </div>
              <p className="mr-4 sm:mr-2">{post?.user?.username}</p>
              <p>{formatDate(post?.createdAt)}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
export default MainPost;
