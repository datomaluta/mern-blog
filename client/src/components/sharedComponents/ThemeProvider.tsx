import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useSelector((state: RootState) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-zinc-700 dark:text-white dark:bg-dark-gray min-h-screen">
        {children}
      </div>
    </div>
  );
}
