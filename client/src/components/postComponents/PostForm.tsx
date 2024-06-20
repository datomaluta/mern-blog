import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { categories } from "../../data/categories";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { FaImage } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPost } from "../../services/post";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import useUploadImage from "../../hooks/useUploadImage";
import { app } from "../../firebase";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type FormData = {
  title: string;
  category: string;
  image: string;
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
  const {
    uploadImage,
    imageFileUploading,
    imageFileUploadError,
    imageFileUploadProgress,
    imgPreview,
  } = useUploadImage(app);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const editorContent = useWatch({ control, name: "content" });
  const imageInput = useWatch({ control, name: "image" }) as any;

  const handleEditorChange = (content: string) => {
    setValue("content", content);
  };

  useEffect(() => {
    register("content", {
      required: true,
    });
  }, [register]);

  useEffect(() => {
    if (imageInput) uploadImage(imageInput[0]);
  }, [imageInput, uploadImage]);

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
    }
  }, [post, setValue, action]);

  return (
    <>
      {action === "edit" && postLoading && <LoadingSpinner blur />}
      <form
        onSubmit={handleSubmit((data) =>
          submitHandler({ ...data, image: imgPreview as string })
        )}
        className="max-w-2xl"
      >
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

            <div className="flex gap-4 justify-center relative  h-28 w-48 border-zinc-600 border border-dashed mx-auto rounded-lg overflow-hidden">
              {imageFileUploading && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  background
                  backgroundPadding={6}
                  className="w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  styles={buildStyles({
                    backgroundColor: "#3e98c7",
                    textColor: "#fff",
                    pathColor: "#fff",
                    trailColor: "transparent",
                  })}
                />
              )}
              {(imgPreview || post?.image) && (
                <img
                  className="w-full h-full object-cover mx-auto rounded-lg"
                  src={imgPreview || post?.image}
                  alt="userImage"
                />
              )}
            </div>
          </div>

          <p className="text-sm text-red-500 mt-1 h-2">
            {imageFileUploadError}
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
