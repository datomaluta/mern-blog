import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { BsLayoutSidebarInset } from "react-icons/bs";
import useOutsideClick from "../../hooks/useOutsideClick";
import { IoMdClose } from "react-icons/io";
import SidebarContent from "../sidebarComponents/SidebarContent";

const DashboardLayout = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLDivElement | null>(null);

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
            className="hidden dark:bg-dark-gray-tint bg-zinc-300 w-[16.25rem] fixed left-0 top-0 h-full mt-[5.25rem] md:mt-[4.25rem] p-4 md:flex flex-col gap-3"
          >
            <SidebarContent key={"desktop"} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="md:hidden dark:bg-dark-gray-tint bg-zinc-300 w-[16.25rem] fixed left-0 top-0 h-full mt-[5.25rem] md:mt-[4.25rem] p-4 flex flex-col gap-3">
        <SidebarContent key={"mobile"} />
      </div>

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
        {<Outlet />}
      </div>
    </div>
  );
};

export default DashboardLayout;
