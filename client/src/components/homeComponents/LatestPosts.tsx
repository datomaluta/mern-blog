import { Link } from "react-router-dom";
import PostCard from "../ui/PostCard";
import { PostType } from "../../types/post";

const LatestPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <>
      <h2 className="mt-36 sm:mt-4 text-2xl font-semibold mb-8">
        Latest posts
      </h2>
      <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
        {posts?.map((post: PostType) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Link
        className="mt-8 block text-center border border-white-shade dark:border-dark-gray-tint w-max mx-auto px-5 py-3 rounded-xl"
        to={"/"}
      >
        View all posts
      </Link>
    </>
  );
};

export default LatestPosts;
