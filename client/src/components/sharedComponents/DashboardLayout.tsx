import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa6";
import { RootState } from "../../redux/store";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <div className="">
      <div className="dark:bg-dark-gray-tint bg-zinc-300 w-[16.25rem] fixed left-0 top-0 h-full mt-[5.25rem] p-4 flex flex-col gap-3">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "dark:bg-dark-gray-shade bg-gray-200 flex justify-between items-center p-2 rounded-lg"
              : "flex justify-between items-center p-2 rounded-lg"
          }
          to={"/dashboard/profile"}
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
        <button className="flex gap-2 items-center p-2 bg:text-zinc-400 text-zinc-500">
          <FaSignOutAlt />
          Sign out
        </button>
      </div>
      <div className="flex-1 ml-[16.25rem] p-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
