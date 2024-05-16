import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useMutation } from "react-query";
import { saveUserInfo } from "../../redux/user/userSlice";
import { updateMe } from "../../services/user";
import toast from "react-hot-toast";
import { generalUserUpdateFormArray } from "../../data/formArray";
import { IoMdCloudUpload } from "react-icons/io";
import { ImSpinner3 } from "react-icons/im";

type FormData = {
  username: string;
  email: string;
  photo: FileList | null;
};

const GeneralUserForm = () => {
  const [imgPreview, setImgPreview] = useState<any>("");
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const formData = new FormData();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      photo: null,
    },
  });

  const avatarInput = useWatch({ control, name: "photo" }) as FileList;
  useEffect(() => {
    if (!avatarInput || avatarInput.length === 0) {
      setImgPreview("");
      return;
    }

    const file: File = avatarInput[0];

    if (
      file instanceof File &&
      ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
    ) {
      const objectUrl = URL.createObjectURL(file);
      setImgPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImgPreview(""); // Clear preview if file is not an image
    }
  }, [avatarInput]);

  const { mutate: userUpdateMutate, isLoading: userUpdateLoading } =
    useMutation({
      mutationFn: updateMe,
      onSuccess: (data) => {
        dispatch(saveUserInfo(data?.data?.data?.user));
        toast.success("User updated successfully");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data.message);
      },
    });

  const submitHandler = async (data: any) => {
    generalUserUpdateFormArray.forEach((field) => {
      if (field.name === "photo") {
        if (data[field.name]) {
          formData.append(field.name, data[field.name][0]);
        }
      } else {
        formData.append(field.name, data[field.name]);
      }
    });

    userUpdateMutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-6 mt-10 p-4"
    >
      <div className="flex flex-col gap-4 mx-auto">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={
            imgPreview ||
            `${import.meta.env.VITE_API_BASE_URL}/images/${currentUser?.photo}`
          }
          alt="photo"
        />
        <input
          {...register("photo", {
            required: false,
            validate: (file: any) => {
              if (avatarInput) {
                if (file[0].size > 2048000) {
                  return "Image is too big";
                }

                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/gif",
                ];
                if (!allowedTypes.includes(file[0].type)) {
                  return "Use only images";
                }

                return true;
              }
            },
          })}
          hidden
          id="photo"
          type="file"
          accept="image/*"
        />
        <label
          htmlFor="photo"
          className="flex items-center gap-2 cursor-pointer dark:bg-zinc-100 bg-dark-gray dark:text-zinc-700 text-white p-2 rounded-lg justify-center font-medium"
        >
          <IoMdCloudUpload />
          Upload
        </label>
        <p>{errors?.photo?.message}</p>
      </div>

      <div>
        <label htmlFor="" className="mb-2 block">
          Username
        </label>
        <input
          {...register("username", {
            required: "Field is required",
          })}
          className="input-with-no-bg"
          type="text"
          placeholder="Username"
        />
        <p className="text-sm text-red-500 mt-1">{errors?.username?.message}</p>
      </div>

      <div>
        <label htmlFor="" className="mb-2 block">
          Email
        </label>
        <input
          {...register("email", {
            required: "Field is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Provide valid email address",
            },
          })}
          className="input-with-no-bg"
          type="email"
          placeholder="Enter your email"
        />
        <p className="text-sm text-red-500 mt-1">{errors?.email?.message}</p>
      </div>

      <button className="submit-button ">
        {userUpdateLoading ? (
          <ImSpinner3 className="animate-spin text-xl" />
        ) : (
          "Save"
        )}
      </button>
    </form>
  );
};

export default GeneralUserForm;
