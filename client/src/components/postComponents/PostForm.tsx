import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { categories } from "../../data/categories";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { FaImage } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/post";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";

type FormData = {
  title: string;
  category: string;
  image: FileList;
  content: string;
};

const PostForm = ({
  submitHandler,
  isPending,
  action,
}: {
  submitHandler: SubmitHandler<FormData>;
  isPending: boolean;
  action: string;
}) => {
  const [imgPreview, setImgPreview] = useState<string>("");
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const editorContent = useWatch({ control, name: "content" });
  const imageInput = useWatch({ control, name: "image" }) as FileList;

  const handleEditorChange = (content: string) => {
    setValue("content", content);
  };

  useEffect(() => {
    register("content", {
      required: true,
    });
  }, [register]);

  useEffect(() => {
    if (!imageInput || imageInput.length === 0) {
      setImgPreview("");
      return;
    }

    const file: File = imageInput[0];

    if (
      file instanceof File &&
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    ) {
      const objectUrl = URL.createObjectURL(file);
      setImgPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImgPreview(""); // Clear preview if file is not an image
    }
  }, [imageInput]);

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id as string).then((res) => res.data?.data?.post),
    enabled: action === "edit",
  });

  useEffect(() => {
    if (action === "edit") {
      setValue("title", post?.title);
      setValue("category", post?.category);
      setValue("content", post?.content);
      setImgPreview(post?.imageUrl);
    }
  }, [post, setValue, action]);

  return (
    <>
      {action === "edit" && postLoading && <LoadingSpinner blur />}
      <form onSubmit={handleSubmit(submitHandler)} className="max-w-2xl">
        <div className="mb-6">
          <input
            {...register("title", {
              required: "Field is required",
            })}
            className="input-with-no-bg "
            type="text"
            placeholder="Post title..."
          />
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.title?.message}
          </p>
        </div>

        <div className="mb-6">
          <select
            className=" rounded-lg w-full dark:bg-dark-gray-tint cursor-pointer border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400 "
            {...register("category", {
              required: "Field is required",
            })}
          >
            <option value="">Choose category</option>
            {categories?.map((category) => (
              <option className="" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>{" "}
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.category?.message}
          </p>
        </div>

        <div className="mb-6">
          <input
            id="image"
            {...register("image", {
              required: action === "create" ? "Field is required" : false,
            })}
            className="input-with-no-bg hidden "
            type="file"
          />

          <div className="border-dashed border-2 border-zinc-600 rounded-lg px-2 py-4 w-full h-56 ">
            <label
              htmlFor="image"
              className="flex items-center gap-1 bg-light-purple p-2 rounded-lg mx-auto text-sm mb-4 cursor-pointer w-max"
            >
              <FaImage className="w-5 h-5" />
              Upload Image
            </label>
            {imgPreview && (
              <img
                className="w-48 h-28 object-cover mx-auto rounded-lg"
                src={imgPreview}
                alt="postimage"
              />
            )}
          </div>

          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.image?.message}
          </p>
        </div>

        <div>
          <ReactQuill
            theme="snow"
            className="h-72 mb-12 placeholder:text-white"
            onChange={handleEditorChange}
            value={editorContent}
          />
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors.category?.message}
          </p>
        </div>
        <button className="submit-button sm:max-w-full !mt-14">
          {isPending ? (
            <ImSpinner3 className="animate-spin text-xl" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
};

export default PostForm;
