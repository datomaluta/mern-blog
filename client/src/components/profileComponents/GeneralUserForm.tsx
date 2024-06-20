import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { saveUserInfo } from "../../redux/user/userSlice";
import { updateMe } from "../../services/user";
import toast from "react-hot-toast";
import { IoMdCloudUpload } from "react-icons/io";
import { ImSpinner3 } from "react-icons/im";
import { useMutation } from "@tanstack/react-query";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Alert } from "flowbite-react";
import useUploadImage from "../../hooks/useUploadImage";

type FormData = {
  username: string;
  email: string;
  photo: FileList | null;
};

const GeneralUserForm = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const {
    uploadImage,
    imageFileUploading,
    imageFileUploadError,
    imageFileUploadProgress,
    imgPreview,
  } = useUploadImage(app);

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

  const imageFile = useWatch({ control, name: "photo" }) as FileList;

  useEffect(() => {
    if (imageFile) uploadImage(imageFile[0]);
  }, [imageFile, uploadImage]);

  const { mutate: userUpdateMutate, isPending: userUpdateLoading } =
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
    const requestObj = { ...data, photo: imgPreview };
    userUpdateMutate(requestObj);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-6 p-4 pb-8"
    >
      <div className="flex flex-col gap-4 mx-auto ">
        <div className="w-32 h-32 relative">
          {imageFileUploadProgress ? (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 100,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          ) : (
            ""
          )}
          <img
            className={`w-32 h-32 rounded-full object-cover  ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            src={imgPreview || currentUser?.photo}
            alt="photo"
          />
        </div>

        <input
          {...register("photo", {
            required: false,
            validate: (file: any) => {
              if (imageFile) {
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

      {imageFileUploadError && (
        <Alert color="failure" className="">
          {imageFileUploadError}
        </Alert>
      )}

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

      <button disabled={imageFileUploading} className="submit-button ">
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
