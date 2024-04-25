import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <div
      className={`${
        pathname.includes("dashboard")
          ? "w-full"
          : "max-w-[75.3rem] mx-auto xl:px-4 md:px-3 "
      } `}
    >
      {children}
    </div>
  );
};

export default Layout;
