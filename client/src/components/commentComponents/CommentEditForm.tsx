import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { updateComment } from "../../services/comments";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { CommentType } from "../../types/comment";
import { useEffect } from "react";

type FormData = {
  content: string;
};

const CommentEditForm = ({
  comment,
  onSuccess,
}: {
  comment: CommentType;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  useEffect(() => {
    setValue("content", comment.content);
  }, [setValue, comment.content]);

  const { mutate: updateCommentMutation, isPending: updateCommentLoading } =
    useMutation({
      mutationFn: updateComment,
      onSuccess: () => onSuccess(),
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      },
    });

  const submitHandler = (data: FormData) => {
    updateCommentMutation({ id: comment._id, data });
  };

  return (
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
        disabled={updateCommentLoading}
        className="bg-light-purple w-24 flex justify-center px-3 py-1 rounded-md text-sm md:text-xs text-white mt-8 ml-auto font-medium"
      >
        {updateCommentLoading ? (
          <ImSpinner3 className="animate-spin text-xl" />
        ) : (
          "Update"
        )}
      </button>
    </form>
  );
};

export default CommentEditForm;
