import "react-quill/dist/quill.snow.css";
import { createPost } from "../../services/post";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import PostForm from "../../components/postComponents/PostForm";
import { useState } from "react";
import { Alert } from "flowbite-react";

type FormData = {
  title: string;
  category: string;
  image: string;
  content: string;
};

const PostCreate = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully");
      setTimeout(() => {
        navigate("/dashboard/posts");
      }, 2000);
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Post create failed, Something went wrong!");
      }
    },
  });
  const submitHandler = (data: FormData) => {
    mutate(data);
  };

  return (
    <div className="mb-40">
      <h1 className="text-lg font-medium mb-5">Create Post</h1>

      <PostForm
        submitHandler={submitHandler}
        isPending={isPending}
        action="create"
      />

      {apiError && (
        <Alert color="failure" className="max-w-2xl sm:max-w-full w-full mt-4">
          {apiError}
        </Alert>
      )}
    </div>
  );
};
export default PostCreate;
