import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./../../assets/images/logo.png";
import mobileLogo from "./../../assets/images/mobileLogo.png";
import mobileLogoWhite from "./../../assets/images/mobileLogoWhite.png";
import whitelogo from "./../../assets/images/whitelogo.png";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DarkModeSwitcher from "../ui/DarkModeSwitcher";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import useOutsideClick from "../../hooks/useOutsideClick";

import { signout } from "../../services/auth";
import { saveUserInfo } from "../../redux/user/userSlice";
import { ImSpinner3 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const [mobileHeaderIsOpen, setMobileHeaderIsOpen] = useState(false);
  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileProfileButtonRef = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useOutsideClick([dropdownRef, profileButtonRef], () => {
    if (window.innerWidth > 800) setProfileDropdownIsOpen(false);
  });

  useOutsideClick([dropdownRef, mobileProfileButtonRef], () => {
    if (window.innerWidth < 800) setProfileDropdownIsOpen(false);
  });

  const {
    refetch: logout,
    isLoading: logoutLoading,
    isSuccess: logoutIsSuccess,
  } = useQuery({
    queryKey: ["logout"],
    queryFn: signout,

    // onSuccess: () => {
    // dispatch(saveUserInfo(null));
    // setMobileHeaderIsOpen(false);
    // setProfileDropdownIsOpen(false);
    // },

    enabled: false,
  });

  useEffect(() => {
    if (logoutIsSuccess) {
      dispatch(saveUserInfo(null));
      setMobileHeaderIsOpen(false);
      setProfileDropdownIsOpen(false);
    }
  }, [logoutIsSuccess, dispatch]);

  const urlParams = new URLSearchParams(location.search);

  const searchHandler = () => {
    if (searchTerm) {
      urlParams.set("search", searchTerm);
      urlParams.set("searchFields", "title,content");
      navigate(`/posts?search=${searchTerm}&searchFields=title,content`);
    }
  };

  return (
    <header className="dark:bg-dark-gray-shade dark:bg-opacity-95 bg-white-shade bg-opacity-95 backdrop-blur-sm sticky top-0 1 py-6  md:py-4 z-30">
      <div
        className={`flex items-center  relative justify-between xl:px-4 md:px-3 w-full 
       md:text-sm  ${
         pathname.includes("dashboard") ? "px-4" : "max-w-[75.3rem] mx-auto"
       }`}
      >
        <Link to={"/"}>
          <img
            className="md:hidden"
            src={theme === "light" ? logo : whitelogo}
            alt="logo"
          />
          <img
            className="hidden md:block"
            src={theme === "light" ? mobileLogo : mobileLogoWhite}
            alt="logo"
          />
        </Link>

        {/* nav */}
        <ul className="flex gap-4 md:hidden">
          <li
            className={`border-b border-transparent pb-1 hover:dark:border-white hover:border-zinc-700 ${
              pathname === "/" && "dark:border-white border-zinc-700"
            }`}
          >
            <Link to={"/"}>Home</Link>
          </li>
          <li
            className={`border-b border-transparent pb-1 hover:dark:border-white hover:border-zinc-700 ${
              pathname === "/posts" && "dark:border-white border-zinc-700"
            }`}
          >
            <Link to={"/posts"}>All Posts</Link>
          </li>
          <li
            className={`border-b border-transparent pb-1 hover:dark:border-white hover:border-zinc-700 ${
              pathname === "/contact" &&
              "dark:border-white border-zinc-700border-white"
            }`}
          >
            <Link to={"/"}>Contact</Link>
          </li>
        </ul>

        <div className="flex gap-5 items-center md:hidden">
          <div className="relative">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search"
              className="bg-zinc-100 dark:bg-dark-gray-tint w-[10.5rem] h-9 rounded-lg p-2 pr-8 outline-none text-sm
          focus:ring-0 focus:border-zinc-400 border-1 border-transparent transition-all duration-300"
            />
            <button
              onClick={searchHandler}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <IoIosSearch className="h-6 w-6 text-zinc-600" />
            </button>
          </div>

          <DarkModeSwitcher />

          {currentUser ? (
            <button
              ref={profileButtonRef}
              onClick={() => {
                setProfileDropdownIsOpen((currState) => !currState);
              }}
            >
              <img
                className="w-9 h-9 rounded-full border-2 border-dark-gray-tint"
                // src={`${import.meta.env.VITE_API_BASE_URL}/images/${
                //   currentUser.photo
                // }`}
                src={currentUser?.imageUrl}
                alt="avatar"
              />
            </button>
          ) : (
            <Link
              to={"/signin"}
              className="border dark:border-zinc-600 border-gray-300 py-1 px-2 rounded-lg
           hover:dark:bg-white hover:dark:text-zinc-700 transition-all duration-300 hover:bg-dark-gray-tint hover:text-white "
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="items-center gap-4 hidden md:flex">
          <button
            onClick={() => setMobileHeaderIsOpen((currState) => !currState)}
          >
            {mobileHeaderIsOpen ? (
              <IoMdClose className="h-7 w-7" />
            ) : (
              <RxHamburgerMenu className="h-7 w-7" />
            )}
          </button>
          {currentUser ? (
            <button
              ref={mobileProfileButtonRef}
              onClick={() =>
                setProfileDropdownIsOpen((currState) => !currState)
              }
            >
              <img
                className="w-8 h-8 rounded-full"
                // src={`${import.meta.env.VITE_API_BASE_URL}/images/${
                //   currentUser.photo
                // }`}
                src={currentUser?.imageUrl}
                alt="avatar"
              />
            </button>
          ) : (
            <Link
              to={"/signin"}
              className="border dark:border-zinc-600 border-gray-300 py-1 px-2 rounded-lg
           hover:dark:bg-white hover:dark:text-zinc-700 transition-all duration-300 hover:bg-dark-gray-tint hover:text-white "
            >
              Sign in
            </Link>
          )}
        </div>

        <AnimatePresence>
          {mobileHeaderIsOpen && (
            <>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "260px", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute bottom-0  translate-y-full left-0 right-0 h-[150rem] px-4 py-4 overflow-hidden hidden md:block dark:bg-dark-gray-shade bg-white-shade z-50 "
              >
                <DarkModeSwitcher className="ml-auto !bg-zinc-500 dark:!bg-dark-gray-tint" />

                <ul className="flex gap-4 flex-col">
                  <li className="border-b border-zinc-600 pb-2">
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li className="border-b border-zinc-600 pb-2">
                    <Link to={"/"}>All Posts</Link>
                  </li>
                  <li className="border-b border-zinc-600 pb-2">
                    <Link to={"/"}>Contact</Link>
                  </li>
                  <li className="border-b border-zinc-600 pb-2">
                    <Link className="flex gap-2" to={"/"}>
                      Search <IoIosSearch className="h-5 w-auto" />
                    </Link>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 translate-y-full left-0 right-0 bg-zinc-900 bg-opacity-75 w-full h-[92vh] z-30"
              ></motion.div>
            </>
          )}
          {profileDropdownIsOpen && (
            <div
              ref={dropdownRef}
              className="dark:bg-gray-800 bg-white-shade absolute -bottom-6 md:-bottom-4  translate-y-full right-0 md:w-[12rem] w-[14rem] rounded overflow-hidden"
            >
              <div className="border-b border-zinc-300 px-2 py-3 flex flex-col gap-1">
                <p>{currentUser?.username}</p>
                <p className="truncate">{currentUser?.email}</p>
              </div>
              <div className="border-b border-zinc-300 px-2 py-3 flex flex-col gap-2">
                <Link
                  className="dark:hover:bg-gray-500 hover:bg-gray-300 rounded"
                  to={"/dashboard"}
                  onClick={() => {
                    setMobileHeaderIsOpen(false);
                    setProfileDropdownIsOpen(false);
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  className="dark:hover:bg-gray-500 hover:bg-gray-300 rounded"
                  to={"/dashboard/profile?tab=general"}
                  onClick={() => {
                    setMobileHeaderIsOpen(false);
                    setProfileDropdownIsOpen(false);
                  }}
                >
                  Profile
                </Link>
              </div>
              <button
                onClick={() => logout()}
                className="px-2 py-3 dark:hover:bg-gray-500 hover:bg-gray-300  w-full text-left flex items-center gap-2"
              >
                Sign out
                {logoutLoading && <ImSpinner3 className="animate-spin" />}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
