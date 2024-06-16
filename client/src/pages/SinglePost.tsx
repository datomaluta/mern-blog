import { useParams } from "react-router-dom";
import { getPost } from "../services/post";
import { PostType } from "../types/post";
import { formatDate } from "../helpers/dateFunctions";
import LoadingSpinner from "../components/sharedComponents/LoadingSpinner";
import { motion } from "framer-motion";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../services/comments";
import { CommentType } from "../types/comment";
import { BiSolidLike } from "react-icons/bi";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { useEffect, useState } from "react";

type CommentFormData = {
  content: string;
};

const SinglePost = () => {
  const [localComments, setLocalComments] = useState<CommentType[]>([]);
  const { slug } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>();

  // get post by slug
  const { data: post, isLoading } = useQuery<PostType>({
    queryKey: ["post", slug],
    enabled: !!slug,
    queryFn: () => getPost(slug as string)?.then((res) => res.data?.data?.post),
  });

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", slug],
    queryFn: ({ pageParam }) => {
      if (!post) {
        return Promise.resolve([]);
      }
      return getPostComments({ page: pageParam, postId: post.id })?.then(
        (res) => res.data?.data?.comments
      );
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
    enabled: !!post,
  });

  useEffect(() => {
    if (comments?.pages) {
      setLocalComments(comments.pages.flat());
    }
  }, [comments]);

  const { mutate: createCommentMutation, isPending: commentLoading } =
    useMutation({
      mutationFn: createComment,
      onSuccess: () => {
        toast.success("Comment added");
        reset();
        queryClient.invalidateQueries({ queryKey: ["comments", slug] });
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const submitHandler = (data: CommentFormData) => {
    createCommentMutation({
      content: data.content,
      postId: post?.id as string,
      userId: currentUser?._id as string,
    });
  };

  const { mutate: likeCommentMutation } = useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    },
    onError: (_, variables) => {
       if (currentUser) {
        setLocalComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === variables
              ? {
                  ...comment,
                  likes: comment.likes.filter((id) => id !== currentUser._id),
                }
              : comment
          )
        );
      }
      toast.error("Something went wrong");
    },
  });

  const handleLike = (commentId: string) => {
    if (currentUser) {
      // Optimistically update the local like state
      setLocalComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: comment.likes.includes(currentUser._id)
                  ? comment.likes.filter((id) => id !== currentUser._id)
                  : [...comment.likes, currentUser._id],
              }
            : comment
        )
      );

      likeCommentMutation(commentId);
    } else {
      toast.error("Please login to like comment");
    }
  };

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

          <div className="border dark:border-zinc-700 border-zinc-300 rounded-lg mt-8 p-4 flex flex-col">
            {currentUser ? (
              <form onSubmit={handleSubmit(submitHandler)}>
                <textarea
                  {...register("content", { required: true })}
                  className="w-full min-h-24 p-4 rounded-lg dark:bg-dark-gray-tint bg-gray-100 border border-zinc-300 dark:border-zinc-700"
                  placeholder="Leave a comment..."
                ></textarea>

                {errors.content && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
                <button className="bg-light-purple w-24 flex justify-center px-3 py-1 rounded-md text-sm md:text-xs text-white mt-8 ml-auto font-medium">
                  {commentLoading ? (
                    <ImSpinner3 className="animate-spin text-xl" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            ) : (
              <p>Please, login to comment</p>
            )}
          </div>

          <div>
            <h1 className="text-xl font-semibold mt-8 mb-7">Comments</h1>
            {status === "pending" && <LoadingSpinner />}

            {status === "success" && (
              <div className="flex flex-col gap-10">
                {localComments.map((comment: CommentType) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={comment?._id}
                    className="flex gap-3 border-b pb-5 dark:border-zinc-700 border-zinc-300"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={comment?.user?.imageUrl}
                        alt="avatar"
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <p className="flex gap-2">
                        <span className="font-medium">
                          {comment?.user?.username}
                        </span>
                        <span className="text-zinc-400">
                          {moment(comment?.createdAt).fromNow()}
                        </span>
                      </p>
                      <p className="dark:text-zinc-400">{comment?.content}</p>
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleLike(comment?._id)}
                          className="flex items-center gap-1"
                        >
                          <BiSolidLike
                            className={`h-4 w-4 ${
                              comment?.likes?.includes(
                                currentUser?._id || ""
                              ) && "text-light-purple"
                            }`}
                          />
                          <span>({comment?.likes?.length})</span>
                        </button>
                        {(comment?.user?._id === currentUser?._id ||
                          currentUser?.role === "admin") && (
                          <button>
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {hasNextPage && (
                  <button
                    className="mt-8 mb-8 block text-center border border-white-shade dark:border-dark-gray-tint w-max mx-auto px-5 py-3 rounded-xl"
                    disabled={isFetchingNextPage || !hasNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            )}

            {comments && comments?.pages[0]?.length === 0 && (
              <h1 className="text-lgtext-center ">No Comment yet</h1>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SinglePost;
