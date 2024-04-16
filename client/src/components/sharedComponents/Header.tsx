import { Link } from "react-router-dom";
import logo from "./../../assets/images/logo.png";
import mobileLogo from "./../../assets/images/mobileLogo.png";
import mobileLogoWhite from "./../../assets/images/mobileLogoWhite.png";
import whitelogo from "./../../assets/images/whitelogo.png";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DarkModeSwitcher from "../ui/DarkModeSwitcher";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const [mobileHeaderIsOpen, setMobileHeaderIsOpen] = useState(false);
  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setProfileDropdownIsOpen(false);
    } else {
      setProfileDropdownIsOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-8 px-4 md:py-4 md:px-3 relative w-full md:text-sm">
      <div>
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
      </div>

      {/* nav */}
      <ul className="flex gap-4 md:hidden">
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/"}>All Posts</Link>
        </li>
        <li>
          <Link to={"/"}>Contact</Link>
        </li>
      </ul>

      <div className="flex gap-5 items-center md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-zinc-100 dark:bg-dark-gray-tint w-[10.5rem] h-9 rounded-[5px] p-2 pr-8 outline-none text-sm
          focus:ring-0 focus:border-zinc-400 border-1 border-transparent transition-all duration-300"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2">
            <IoIosSearch className="h-6 w-6 text-zinc-600" />
          </button>
        </div>

        <DarkModeSwitcher />

        <button
          onClick={() => setProfileDropdownIsOpen((currState) => !currState)}
        >
          <FaUserCircle className="h-7 w-7" />
        </button>
      </div>

      <div className="items-center gap-4 hidden md:flex">
        <button
          onClick={() => setMobileHeaderIsOpen((currState) => !currState)}
        >
          <RxHamburgerMenu className="h-7 w-7" />
        </button>
        <button
          onClick={() => setProfileDropdownIsOpen((currState) => !currState)}
        >
          <FaUserCircle className="h-7 w-7" />
        </button>
      </div>

      <AnimatePresence>
        {mobileHeaderIsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "260px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute bottom-0 translate-y-full left-0 right-0 h-[15rem] px-4 py-4 overflow-hidden hidden md:block dark:bg-dark-gray-shade bg-white-shade"
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
        )}
        {profileDropdownIsOpen && (
          <div
            ref={dropdownRef}
            className="dark:bg-gray-800 bg-white-shade absolute -bottom-0 translate-y-full right-2 md:w-[12rem] w-[14rem] rounded overflow-hidden"
          >
            <div className="border-b border-zinc-300 px-2 py-3 flex flex-col gap-1">
              <p>dmaluta</p>
              <p className="truncate">datomaluta@gmail.com</p>
            </div>
            <div className="border-b border-zinc-300 px-2 py-3 flex flex-col gap-2">
              <Link
                className="dark:hover:bg-gray-500 hover:bg-gray-300 rounded"
                to={"/"}
              >
                Dashboard
              </Link>
              <Link
                className="dark:hover:bg-gray-500 hover:bg-gray-300 rounded"
                to={"/"}
              >
                Profile
              </Link>
            </div>
            <button className="px-2 py-3 dark:hover:bg-gray-500 hover:bg-gray-300 block w-full text-left">
              Sign out
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
