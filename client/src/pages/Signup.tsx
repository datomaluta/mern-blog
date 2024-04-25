import { LuUser } from "react-icons/lu";
import signupImage from "./../assets/images/signupImage.png";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock, CiUnlock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signup } from "../services/auth";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import { ImSpinner3 } from "react-icons/im";
import { Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { getObjectLength } from "../helpers/objectFunctions";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../redux/user/userSlice";

const Signup = () => {
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm({ mode: "onSubmit" });
  const errorsLength = getObjectLength(errors);

  const passwordInput = useWatch({ name: "password", control });
  const passwordConfirmInput = useWatch({ name: "passwordConfirm", control });

  const { mutate: signupMutation, isLoading: signupLoading } = useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      console.log(response);
      navigate("/");
      dispatch(saveUserInfo(response?.data?.data?.user));
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Sign up failed, Something went wrong!");
      }
    },
  });

  const submitHandler = async (data: any) => {
    if (passwordInput !== passwordConfirmInput) {
      setError("passwordConfirm", {
        type: "custom",
        message: "Passwords does not match",
      });
    } else {
      signupMutation(data);
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
    <div>
      <div className="w-3/4 lg:w-full md:w-full mx-auto flex gap-4 mt-10 sm:mt-4">
        <div className="w-1/2 md:hidden transition-all mt-32">
          <img
            className="transition-all"
            src={signupImage}
            alt="signup-image"
          />
        </div>
        <div className=" w-1/2 p-4 md:w-full">
          <h1 className="text-2xl text-center mb-6">Sign up</h1>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-6 items-center justify-center mb-4"
          >
            <div className="relative max-w-80 sm:max-w-full w-full">
              <LuUser className="icon-of-input" />
              <input
                {...register("username", {
                  required: "Field is required",
                })}
                className="input-with-no-bg pl-10"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            {/* <p>{errors && errors["username"]?.message}</p> */}

            <div className="relative max-w-80 sm:max-w-full w-full">
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
            {/* <p>{errors && errors["email"]?.message}</p> */}

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
            {/* <p>{errors && errors["password"]?.message}</p> */}

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
            {/* <p>{errors && errors["passwordConfirm"]?.message}</p> */}

            <button className="submit-button ">
              {signupLoading ? (
                <ImSpinner3 className="animate-spin text-xl" />
              ) : (
                "Sign up"
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
                      <span className="font-medium capitalize">
                        {error.key}:
                      </span>
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
          <p className="text-center mt-8 dark:text-zinc-400 text-sm">
            Or sign up with
          </p>

          <button className="flex gap-2 items-center border border-zinc-300 dark:border-zinc-600 p-2 rounded-lg mx-auto mt-3 hover:bg-dark-gray hover:dark:bg-dark-gray-shade hover:text-white hover: transition-all">
            <FcGoogle />
            Google
          </button>

          <p className="dark:text-zinc-400 text-sm text-center mt-7">
            Already have an account?{" "}
            <Link to={"/signin"} className="dark:text-white underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
