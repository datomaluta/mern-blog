import { useForm } from "react-hook-form";
import { MdOutlineEmail } from "react-icons/md";
import { useMutation } from "react-query";
import { forgotPassword } from "../../services/auth";
import { ImSpinner3 } from "react-icons/im";
import { Alert } from "flowbite-react";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";

const ForgotPasswordForm = ({
  setModalIsOpen,
}: {
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data: any) => {
      console.log(data);
      toast.success("Reset email sent succesfully!");
      setTimeout(() => {
        setModalIsOpen(false);
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const submitHandler = (data: any) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col justify-center items-center w-full"
    >
      <div className="relative max-w-80 sm:max-w-full w-full mb-6">
        <MdOutlineEmail className="icon-of-input" />
        <input
          {...register("email", {
            required: "Field is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Provide valid email address",
            },
          })}
          className="input-with-no-bg pl-10 "
          type="email"
          placeholder="Enter your email"
        />
      </div>

      <button className="submit-button  max-w-80 sm:max-w-full">
        {isLoading ? <ImSpinner3 className="animate-spin text-xl" /> : "Submit"}
      </button>

      {errors?.email?.message ? (
        <Alert
          color="failure"
          className="max-w-80 sm:max-w-full w-full mx-auto mt-4"
        >
          {(errors?.email?.message as string) || ""}
        </Alert>
      ) : (
        ""
      )}
    </form>
  );
};

export default ForgotPasswordForm;
