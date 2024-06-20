import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { googleAuth } from "../../services/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/user/userSlice";
import toast from "react-hot-toast";

const OAuth = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: googleAuthMutate } = useMutation({
    mutationFn: googleAuth,
    onSuccess: (response) => {
      dispatch(saveUserInfo(response?.data?.data?.user));
      navigate("/");
    },
    onError: () => {
      toast.error("Sign in failed, Something went wrong!");
    },
  });

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const resultsFromGoogle = await signInWithPopup(auth, provider);
    console.log(resultsFromGoogle);
    googleAuthMutate({
      name: resultsFromGoogle.user.displayName,
      email: resultsFromGoogle.user.email,
      googlePhotoUrl: resultsFromGoogle.user.photoURL,
    });
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="flex gap-2 items-center border border-zinc-300 dark:border-zinc-600 p-2 rounded-lg mx-auto mt-3 hover:bg-dark-gray hover:dark:bg-dark-gray-shade hover:text-white hover: transition-all"
    >
      <FcGoogle />
      Google
    </button>
  );
};

export default OAuth;
