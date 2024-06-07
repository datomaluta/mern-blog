import { FaNewspaper, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../redux/store";
import { signout } from "../../services/auth";
import { saveUserInfo } from "../../redux/user/userSlice";
import { ImSpinner3 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const SidebarContent = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const {
    refetch: logout,
    isLoading: logoutLoading,
    isSuccess: logoutIsSuccess,
  } = useQuery({
    queryKey: ["logout"],
    queryFn: signout,

    enabled: false,
  });
  useEffect(() => {
    if (logoutIsSuccess) {
      dispatch(saveUserInfo(null));
    }
  }, [logoutIsSuccess, dispatch]);

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive
            ? "dark:bg-dark-gray-shade bg-gray-200 flex justify-between items-center p-2 rounded-lg"
            : "flex justify-between items-center p-2 rounded-lg"
        }
        to={"/dashboard/profile?tab=general"}
      >
        <span className="flex gap-2 items-center">
          <FaUser />
          Profile
        </span>
        <span className="dark:bg-dark-gray bg-none px-2 py-1 rounded-lg text-xs border border-zinc-600">
          {currentUser?.role}
        </span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          isActive
            ? "dark:bg-dark-gray-shade bg-gray-200 flex items-center p-2 rounded-lg"
            : "flex items-center p-2 rounded-lg"
        }
        to={"/dashboard/posts"}
      >
        <span className="flex gap-2 items-center">
          <FaNewspaper />
          Posts
        </span>
      </NavLink>
      <button
        onClick={() => logout()}
        className="flex gap-2 items-center p-2 bg:text-zinc-400 text-zinc-500"
      >
        <FaSignOutAlt />
        {logoutLoading ? <ImSpinner3 className="animate-spin" /> : "Sign out"}
      </button>
    </>
  );
};

export default SidebarContent;
