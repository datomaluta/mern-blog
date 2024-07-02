import { Link } from "react-router-dom";
import { formatDate } from "../../helpers/dateFunctions";
import { PostType } from "../../types/post";
import LazyImageDisplay from "./LazyImageDisplay";

const PostCard = ({ post }: { post: PostType }) => {
  return (
    <Link
      to={`/posts/${post.slug}`}
      key={post?._id}
      className="p-4 border dark:border-dark-gray-tint border-white-shade rounded-xl flex flex-col hover:dark:bg-dark-gray-tint hover:bg-white-shade transition-all duration-300 group"
    >
      <div className="object-cover rounded-xl overflow-hidden max-w-[360px] max-h-[15rem] h-[15rem] sm:h-[12rem] lg:max-w-full mb-4">
        <LazyImageDisplay imageUrl={post.image} alt={post.title} />
        {/* <img
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
          src={post.image}
          alt={post.title}
        /> */}
      </div>

      <p className="dark:bg-light-purple bg-white-shade dark:bg-opacity-10 bg-opacity-70 mb-4 w-max px-3 py-1 rounded-md text-sm md:text-xs text-light-purple">
        {post.category}
      </p>

      <div className="mb-4">
        <h1 className="text-2xl xl:text-xl sm:text-lg font-semibold line-clamp-3  leading-10 ">
          {post.title}
        </h1>
      </div>

      <div className="flex items-center dark:text-zinc-500 text-zinc-400 lg:text-sm mt-auto ">
        <div className="w-9 md:w-7 h-9 md:h-7 rounded-full overflow-hidden mr-2 sm:mr-1">
          <img
            className="w-full h-full  object-cover"
            src={post?.user?.photo}
            alt="avatar"
          />
        </div>
        <p className="mr-4 sm:mr-2">{post?.user?.username}</p>
        <p>{formatDate(post?.createdAt)}</p>
      </div>
    </Link>
  );
};

export default PostCard;
