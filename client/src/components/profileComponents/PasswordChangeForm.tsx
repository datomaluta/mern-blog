import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { updateMyPassword } from "../../services/user";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

type FormData = {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
};

const PasswordChangeForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>();

  const { mutate: passwordUpdateMutate, isLoading: passwordUpdateLoading } =
    useMutation({
      mutationFn: updateMyPassword,
      onSuccess: () => {
        toast.success("Password updated successfully");
        reset();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message);
      },
    });

  const submitHandler = async (data: any) => {
    passwordUpdateMutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-6 mt-10 p-4"
    >
      <div>
        <label htmlFor="" className="mb-2 block">
          Current password
        </label>
        <input
          {...register("passwordCurrent", {
            required: "Field is required",
          })}
          className="input-with-no-bg"
          type="password"
          placeholder="Enter your current password"
        />
        <p className="text-sm text-red-500 mt-1">
          {errors?.passwordCurrent?.message}
        </p>
      </div>

      <div>
        <label htmlFor="" className="mb-2 block">
          New password
        </label>
        <input
          {...register("password", {
            required: "Field is required",
          })}
          className="input-with-no-bg"
          type="password"
          placeholder="Enter your new password"
        />
        <p className="text-sm text-red-500 mt-1">{errors?.password?.message}</p>
      </div>

      <div>
        <label htmlFor="" className="mb-2 block">
          Confirm password
        </label>
        <input
          {...register("passwordConfirm", {
            required: "Field is required",
          })}
          className="input-with-no-bg"
          type="password"
          placeholder="Comfirm your new password"
        />
        <p className="text-sm text-red-500 mt-1">{errors?.password?.message}</p>
      </div>

      <button className="submit-button ">
        {passwordUpdateLoading ? (
          <ImSpinner3 className="animate-spin text-xl" />
        ) : (
          "Save"
        )}
      </button>
    </form>
  );
};

export default PasswordChangeForm;
