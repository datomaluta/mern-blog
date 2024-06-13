import "react-quill/dist/quill.snow.css";
import { userFormArray } from "../../data/formArray";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "flowbite-react";
import { updateUser } from "../../services/user";
import UserForm from "../../components/userComponents/UserForm";

type FormData = {
  username: string;
  email: string;
  role: string;
  photo: FileList;
};

const UserEdit = () => {
  const formData = new FormData();
  const navigate = useNavigate();
  const { id } = useParams();
  const [apiError, setApiError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully");
      setTimeout(() => {
        navigate("/dashboard/users");
      }, 2000);
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("User update failed, Something went wrong!");
      }
    },
  });
  const submitHandler = (data: FormData) => {
    userFormArray.forEach((field: { name: string }) => {
      if (field.name === "photo") {
        if (data["photo"][0]) {
          formData.append(field.name, data["photo"][0]);
        }
      } else {
        formData.append(
          field.name,
          data[field.name as keyof FormData] as string
        );
      }
    });

    mutate({
      data: formData,
      id: id as string,
    });
  };

  return (
    <div className="mb-40">
      <h1 className="text-lg font-medium mb-5">Update User</h1>
      <UserForm
        submitHandler={submitHandler}
        isPending={isPending}
        action="edit"
      />

      {apiError && (
        <Alert color="failure" className="max-w-2xl sm:max-w-full w-full mt-4">
          {apiError}
        </Alert>
      )}
    </div>
  );
};
export default UserEdit;
