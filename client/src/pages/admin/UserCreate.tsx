import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "flowbite-react";
import UserForm from "../../components/userComponents/UserForm";
import { createUser } from "../../services/user";

type FormData = {
  username: string;
  email: string;
  role: string;
  password: string;
  photo: string;
};

const UserCreate = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully");
      setTimeout(() => {
        navigate("/dashboard/users");
      }, 2000);
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("User create failed, Something went wrong!");
      }
    },
  });
  const submitHandler = (data: FormData) => {
    mutate({ ...data, passwordConfirm: data.password });
  };

  return (
    <div className="mb-40">
      <h1 className="text-lg font-medium mb-5">Create User</h1>

      <UserForm
        submitHandler={submitHandler}
        isPending={isPending}
        action="create"
      />

      {apiError && (
        <Alert color="failure" className="max-w-2xl sm:max-w-full w-full mt-4">
          {apiError}
        </Alert>
      )}
    </div>
  );
};
export default UserCreate;
