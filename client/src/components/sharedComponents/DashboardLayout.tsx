import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa6";
import { RootState } from "../../redux/store";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { signout } from "../../services/auth";
import { saveUserInfo } from "../../redux/user/userSlice";
import { ImSpinner3 } from "react-icons/im";
import { AnimatePresence, motion } from "framer-motion";
import { BsLayoutSidebarInset } from "react-icons/bs";
import useOutsideClick from "../../hooks/useOutsideClick";
import { IoMdClose } from "react-icons/io";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const { refetch: logout, isLoading: logoutLoading } = useQuery({
    queryKey: ["logout"],
    queryFn: signout,
    onSuccess: () => {
      dispatch(saveUserInfo(null));
    },
    enabled: false,
  });

  useEffect(() => {
    if (window.innerWidth > 800) {
      setSidebarIsOpen(true);
    } else if (window.innerWidth <= 800) {
      setSidebarIsOpen(false);
    }
  }, []);

  useOutsideClick([sidebarRef, menuButtonRef], () => {
    if (window.innerWidth <= 800) setSidebarIsOpen(false);
  });

  return (
    <div className="">
      <AnimatePresence>
        {sidebarIsOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: window.innerWidth <= 800 ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
            className="dark:bg-dark-gray-tint bg-zinc-300 w-[16.25rem] fixed left-0 top-0 h-full mt-[5.25rem] md:mt-[4.25rem] p-4 flex flex-col gap-3"
          >
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
              {logoutLoading ? (
                <ImSpinner3 className="animate-spin" />
              ) : (
                "Sign out"
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 p-4 ml-[16.25rem] md:ml-0">
        <button
          onClick={() => {
            setSidebarIsOpen((prevState) => !prevState);
          }}
          className="hidden md:flex items-center gap-1 border border-zinc-500 px-2 py-1 rounded-lg mb-3 ml-auto "
          ref={menuButtonRef as any}
        >
          {sidebarIsOpen ? <IoMdClose /> : <BsLayoutSidebarInset />}
          {sidebarIsOpen ? "Close" : "Menu"}
        </button>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
