import signupImage from "./../assets/images/signupImage.png";
import { MdOutlineEmail } from "react-icons/md";
import { CiUnlock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signin } from "../services/auth";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ImSpinner3 } from "react-icons/im";
import { Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { getObjectLength } from "../helpers/objectFunctions";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../redux/user/userSlice";
import ForgotPasswordForm from "../components/signinComponents/ForgotPasswordForm";
import ModalWrapper from "../components/uiComponents/ModalWrapper";
import { AnimatePresence } from "framer-motion";

const SignIn = () => {
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] =
    useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onSubmit" });
  const errorsLength = getObjectLength(errors);

  const { mutate: signinMutation, isLoading: signinLoading } = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      navigate("/");
      dispatch(saveUserInfo(response?.data?.data?.user));
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Sign in failed, Something went wrong!");
      }
    },
  });

  const submitHandler = async (data: any) => {
    signinMutation(data);
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
      <AnimatePresence>
        {forgotPasswordModalIsOpen && (
          <ModalWrapper setModalIsVisible={setForgotPasswordModalIsOpen}>
            <h1 className="text-center text-lg mb-6">Forgot your password?</h1>
            <ForgotPasswordForm setModalIsOpen={setForgotPasswordModalIsOpen} />
          </ModalWrapper>
        )}
      </AnimatePresence>
      <div className="w-3/4 lg:w-full md:w-full mx-auto flex gap-4 mt-10 sm:mt-4">
        <div className="w-1/2 md:hidden transition-all mt-32">
          <img
            className="transition-all"
            src={signupImage}
            alt="signup-image"
          />
        </div>
        <div className=" w-1/2 p-4 md:w-full">
          <h1 className="text-2xl text-center mb-6">Sign in</h1>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-6 items-center justify-center mb-4"
          >
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
                placeholder="Enter your password"
              />
            </div>

            {/* <p>{errors && errors["passwordConfirm"]?.message}</p> */}

            <button
              type="button"
              className="text-gray-500 underline text-right"
              onClick={() => setForgotPasswordModalIsOpen(true)}
            >
              Forgot password?
            </button>
            <button className="submit-button  max-w-80 sm:max-w-full">
              {signinLoading ? (
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
            Or sign in with
          </p>

          <button className="flex gap-2 items-center border border-zinc-300 dark:border-zinc-600 p-2 rounded-lg mx-auto mt-3 hover:bg-dark-gray hover:dark:bg-dark-gray-shade hover:text-white hover: transition-all">
            <FcGoogle />
            Google
          </button>

          <p className="dark:text-zinc-400 text-sm text-center mt-7 flex gap-2 justify-center">
            Don't have an account?
            <Link to={"/signup"} className="dark:text-white underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
