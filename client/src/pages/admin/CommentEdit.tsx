import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCommentById } from "../../services/comments";
import CommentEditForm from "../../components/commentComponents/CommentEditForm";
import LoadingSpinner from "../../components/sharedComponents/LoadingSpinner";

const CommentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: comment, isLoading: commentLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      getCommentById(id as string)?.then((res) => res?.data?.data?.comment),
    enabled: !!id,
  });

  return (
    <div className="mb-40">
      <h1 className="text-lg font-medium mb-5">Edit Comment</h1>
      {commentLoading && <LoadingSpinner blur />}
      {comment && (
        <CommentEditForm
          comment={comment}
          onSuccess={() => {
            toast.success("Comment updated successfully");
            setTimeout(() => {
              navigate("/dashboard/comments");
            }, 2000);
          }}
        />
      )}
    </div>
  );
};
export default CommentEdit;
