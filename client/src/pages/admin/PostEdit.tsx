import "react-quill/dist/quill.snow.css";
import { postFormArray } from "../../data/formArray";
import { updatePost } from "../../services/post";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import PostForm from "../../components/postComponents/PostForm";
import { useState } from "react";
import { Alert } from "flowbite-react";

type FormData = {
  title: string;
  category: string;
  image: FileList;
  content: string;
};

const PostEdit = () => {
  const formData = new FormData();
  const navigate = useNavigate();
  const { id } = useParams();
  const [apiError, setApiError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated successfully");
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
    postFormArray.forEach((field: { name: string }) => {
      if (field.name === "image") {
        if (data["image"][0]) {
          console.log("DATA FIELD NAME", data[field.name]);
          formData.append(field.name, data["image"][0]);
        }
      } else {
        formData.append(
          field.name,
          data[field.name as keyof FormData] as string
        );
      }
    });

    mutate({
      data: formData,
      id: id as string,
    });
  };

  return (
    <div className="mb-40">
      <h1 className="text-lg font-medium mb-5">Create Post</h1>
      <PostForm
        submitHandler={submitHandler}
        isPending={isPending}
        action="edit"
      />

      {apiError && (
        <Alert color="failure" className="max-w-2xl sm:max-w-full w-full mt-4">
          {apiError}
        </Alert>
      )}
    </div>
  );
};
export default PostEdit;
