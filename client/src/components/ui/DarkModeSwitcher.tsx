import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { IoIosSunny, IoMdMoon } from "react-icons/io";
import { RootState } from "../../redux/store";

const DarkModeSwitcher = ({ className }: { className?: string }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`w-12 h-7 shrink-0 rounded-full py-[2px] block px-[3px] ${
        theme === "light" ? "bg-zinc-200" : "bg-dark-gray-tint"
      } transition-all duration-300 ${className}`}
    >
      <div
        className={`h-6 w-6 rounded-full bg-white ftransition-all duration-300 flex items-center justify-center 
      
        ${theme === "light" ? "translate-x-0" : "translate-x-3/4"}`}
      >
        {theme === "light" ? (
          <IoIosSunny className="text-dark-gray w-4 h-4 transition-all duration-300" />
        ) : (
          <IoMdMoon className="text-dark-gray w-4 h-4 transition-all duration-300" />
        )}
      </div>
    </button>
  );
};

export default DarkModeSwitcher;
