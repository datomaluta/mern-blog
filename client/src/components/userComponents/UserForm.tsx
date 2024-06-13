import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { ImSpinner3 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../sharedComponents/LoadingSpinner";
import { getUserById } from "../../services/user";

type FormData = {
  username: string;
  email: string;
  role: string;
  password: FileList;
  photo: FileList;
};

const UserForm = ({
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

  const imageInput = useWatch({ control, name: "photo" }) as FileList;

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

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      getUserById(id as string).then((res) => res.data?.data?.user),
    enabled: action === "edit",
  });

  useEffect(() => {
    if (action === "edit") {
      setValue("username", user?.username);
      setValue("email", user?.email);
      setValue("role", user?.role);
      setImgPreview(user?.imageUrl);
    }
  }, [user, setValue, action]);

  return (
    <>
      {action === "edit" && userLoading && <LoadingSpinner blur />}
      <form onSubmit={handleSubmit(submitHandler)} className="max-w-2xl">
        <div className="mb-6">
          <input
            {...register("username", {
              required: "Field is required",
            })}
            className="input-with-no-bg "
            type="text"
            placeholder="Enter username..."
          />
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.username?.message}
          </p>
        </div>

        <div className="mb-6">
          <input
            {...register("email", {
              required: "Field is required",
            })}
            className="input-with-no-bg "
            type="text"
            placeholder="Enter email..."
          />
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.email?.message}
          </p>
        </div>

        <div className="mb-6">
          <select
            className=" rounded-lg w-full dark:bg-dark-gray-tint cursor-pointer border-1 dark:border-zinc-500 border-zinc-200 focus:ring-0 dark:focus:border-zinc-200 focus:border-zinc-400 "
            {...register("role", {
              required: "Field is required",
            })}
          >
            <option value="">Choose role</option>
            {["admin", "user"]?.map((category) => (
              <option className="" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>{" "}
          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.role?.message}
          </p>
        </div>

        <div className="mb-6">
          <input
            id="image"
            {...register("photo", {
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
                alt="userImage"
              />
            )}
          </div>

          <p className="text-sm text-red-500 mt-1 h-2">
            {errors?.photo?.message}
          </p>
        </div>

        {action === "create" && (
          <div className="mb-6">
            <input
              {...register("password", {
                required: "Field is required",
              })}
              className="input-with-no-bg "
              type="password"
              placeholder="Enter password..."
            />
            <p className="text-sm text-red-500 mt-1 h-2">
              {errors?.password?.message}
            </p>
          </div>
        )}

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

export default UserForm;
