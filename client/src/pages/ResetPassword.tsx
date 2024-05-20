import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import { resetPassword } from "../services/auth";
import { CiLock, CiUnlock } from "react-icons/ci";
import { ImSpinner3 } from "react-icons/im";
import { getObjectLength } from "../helpers/objectFunctions";
import { useEffect, useState } from "react";
import { Alert } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../redux/user/userSlice";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    reset,
  } = useForm();
  const errorsLength = getObjectLength(errors);

  const passwordInput = useWatch({ name: "password", control });
  const passwordConfirmInput = useWatch({ name: "passwordConfirm", control });

  const { mutate, isLoading } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      console.log(data);
      reset();
      toast.success("Password updated succesfully");
      dispatch(saveUserInfo(data?.data?.data?.user));
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Sign in failed, Something went wrong!");
      }
    },
  });
  const submitHandler = (data: any) => {
    if (passwordInput !== passwordConfirmInput) {
      setError("passwordConfirm", {
        type: "custom",
        message: "Passwords does not match",
      });
    } else {
      mutate({ data, resetToken: resetToken as string });
    }
  };

  useEffect(() => {
    const errorsArr = [];
    for (const key in errors) {
      errorsArr.push({ key, message: errors[key]?.message });
    }
    setFormErrors(errorsArr);
  }, [errors, errorsLength]);

  return (
    <div className="mt-10">
      <div className="flex flex-col justify-center items-center max-w-80 mx-auto w-full ">
        <h1 className="text-lg text-center  w-full mb-6">Set new password</h1>
        <form
          className="flex flex-col gap-6 w-full m-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="relative max-w-80 sm:max-w-full w-full">
            <CiUnlock className="icon-of-input" />
            <input
              {...register("password", {
                required: "Field is required",
                minLength: {
                  value: 4,
                  message: "Password minimum length is 4",
                },
              })}
              className="input-with-no-bg pl-10"
              type="password"
              placeholder="Create password"
            />
          </div>

          <div className="relative max-w-80 sm:max-w-full w-full">
            <CiLock className="icon-of-input" />
            <input
              {...register("passwordConfirm", {
                required: "Field is required",
                minLength: {
                  value: 4,
                  message: "Password minimum length is 4",
                },
              })}
              className="input-with-no-bg pl-10"
              type="password"
              placeholder="Confirm password"
            />
          </div>

          <button className="submit-button  max-w-80 sm:max-w-full">
            {isLoading ? (
              <ImSpinner3 className="animate-spin text-xl" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {formErrors?.length ? (
          <Alert
            color="failure"
            className="max-w-80 sm:max-w-full w-full mx-auto"
          >
            <ul className="flex flex-col gap-1">
              {formErrors?.map(
                (error: { key: string; message: string }, index: number) => (
                  <li className="flex gap-2" key={index}>
                    <span className="font-medium capitalize">{error.key}:</span>
                    {error.message}
                  </li>
                )
              )}
            </ul>
          </Alert>
        ) : (
          ""
        )}
        {apiError && formErrors?.length === 0 ? (
          <Alert
            color="failure"
            className="max-w-80 sm:max-w-full w-full mx-auto"
          >
            {apiError}
          </Alert>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
