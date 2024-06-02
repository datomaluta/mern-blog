import { getPosts } from "../services/post";
import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
import { motion } from "framer-motion";
import MainPost from "../components/homeComponents/MainPost";
import LatestPosts from "../components/homeComponents/LatestPosts";
import { PostType } from "../types/post";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: posts, isLoading: postsLoading } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: () => getPosts({ page: 1 }).then((res) => res.data?.data?.posts),
  });

  return (
    <div className="mt-10 pb-40 min-h-screen">
      {postsLoading && <LoadingSpinner blur />}

      {!postsLoading && !posts?.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1 className="text-2xl font-bold text-center mt-20">
            No posts found
          </h1>
        </motion.div>
      )}

      {!postsLoading && posts?.length ? (
        <>
          <MainPost post={posts[0]} />
          <LatestPosts posts={posts} />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
