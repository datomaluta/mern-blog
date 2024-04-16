import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="max-w-[75.3rem] mx-auto">{children}</div>;
};

export default Layout;
