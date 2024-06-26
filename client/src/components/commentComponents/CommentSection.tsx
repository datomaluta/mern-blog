import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getPostComments,
  likeComment,
} from "../../services/comments";
import { useParams } from "react-router-dom";
import { PostType } from "../../types/post";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CommentType } from "../../types/comment";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import { AnimatePresence, motion } from "framer-motion";
import { BiSolidLike } from "react-icons/bi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import ModalWrapper from "../ui/ModalWrapper";
import CommentEditForm from "./CommentEditForm";

type CommentFormData = {
  content: string;
};

const CommentSection = ({ post }: { post: PostType }) => {
  const [localComments, setLocalComments] = useState<CommentType[]>([]);
  const [chosenComment, setChosenComment] = useState<CommentType>();
  const [editCommentModalIsOpen, setEditCommentModalIsOpen] = useState(false);
  const [deleteCommentModalIsOpen, setDeleteCommentModalIsOpen] =
    useState(false);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { slug } = useParams();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>();

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
      return getPostComments({ page: pageParam, postId: post._id })?.then(
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
      postId: post?._id as string,
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

  const { mutate: deleteMutation, isPending: isDeletingLoading } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      setTimeout(() => {
        toast.success("Comment deleted successfully");
        setDeleteCommentModalIsOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["comments", slug],
        });
      }, 200);
    },
    onError: () => {
      toast.error("Something went wrong with delete!");
    },
  });

  return (
    <>
      <AnimatePresence>
        {editCommentModalIsOpen && chosenComment && (
          <ModalWrapper setModalIsVisible={setEditCommentModalIsOpen}>
            <h1 className="text-lg font-medium text-center mb-6">
              Edit Comment
            </h1>
            <CommentEditForm
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["comments", slug] });
                toast.success("Comment updated successfully");
                setTimeout(() => {
                  setEditCommentModalIsOpen(false);
                }, 2000);
              }}
              comment={chosenComment}
            />
          </ModalWrapper>
        )}

        {deleteCommentModalIsOpen && chosenComment && (
          <ModalWrapper setModalIsVisible={setDeleteCommentModalIsOpen}>
            <h3 className="text-center mt-10">
              Are you sure you want to delete this comment?
            </h3>
            <div className="mt-auto flex gap-4 justify-around">
              <button
                onClick={() => deleteMutation(chosenComment?._id)}
                className="bg-light-purple px-4 py-1 rounded-lg"
              >
                {isDeletingLoading ? <LoadingSpinner /> : "Yes"}
              </button>
              <button className="">No</button>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

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
            <button
              disabled={commentLoading}
              className="bg-light-purple w-24 flex justify-center px-3 py-1 rounded-md text-sm md:text-xs text-white mt-8 ml-auto font-medium"
            >
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
                    src={comment?.user?.photo}
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
                  <div className="flex gap-5 items-center">
                    <button
                      onClick={() => handleLike(comment?._id)}
                      className="flex items-center gap-1"
                    >
                      <BiSolidLike
                        className={`h-4 w-4 ${
                          comment?.likes?.includes(currentUser?._id || "") &&
                          "text-light-purple"
                        }`}
                      />
                      <span>({comment?.likes?.length})</span>
                    </button>

                    {(comment?.user?._id === currentUser?._id ||
                      currentUser?.role === "admin") && (
                      <button
                        onClick={() => {
                          setChosenComment(comment);
                          setEditCommentModalIsOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    )}

                    {(comment?.user?._id === currentUser?._id ||
                      currentUser?.role === "admin") && (
                      <button
                        onClick={() => {
                          setDeleteCommentModalIsOpen(true);
                          setChosenComment(comment);
                        }}
                      >
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
    </>
  );
};

export default CommentSection;
