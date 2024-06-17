import { useParams } from "react-router-dom";
import { getPost } from "../services/post";
import { PostType } from "../types/post";
import { formatDate } from "../helpers/dateFunctions";
import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import CommentSection from "../components/commentComponents/CommentSection";

const SinglePost = () => {
  const { slug } = useParams();

  // get post by slug
  const { data: post, isLoading } = useQuery<PostType>({
    queryKey: ["post", slug],
    enabled: !!slug,
    queryFn: () => getPost(slug as string)?.then((res) => res.data?.data?.post),
  });

  return (
    <>
      {isLoading && <LoadingSpinner blur />}
      {!isLoading && post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-[50rem] mx-auto mt-10"
        >
          <p className="bg-light-purple w-max px-3 py-1 rounded-md text-sm md:text-xs text-white">
            {post?.category}
          </p>
          <h1 className="text-4xl font-bold lg:text-2xl md:text-xl mt-4">
            {post?.title}
          </h1>
          <div className="flex items-center dark:text-zinc-500 text-zinc-400 text-sm mt-5 ">
            <div className="w-9 md:w-7 h-9 md:h-7 rounded-full overflow-hidden object-cover mr-2 sm:mr-1">
              <img
                className="w-full h-full"
                src={post?.user?.imageUrl}
                alt="avatar"
              />
            </div>
            <p className="mr-4 sm:mr-2"> {post?.user?.username}</p>
            <p>{formatDate(post?.createdAt)}</p>
          </div>
          <div className="w-full max-h-[29rem] overflow-hidden rounded-xl mt-8">
            <img
              className="h-full w-full object-cover"
              src={post?.imageUrl}
              alt={post?.title}
            />
          </div>
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <CommentSection post={post} />
        </motion.div>
      )}
    </>
  );
};

export default SinglePost;
