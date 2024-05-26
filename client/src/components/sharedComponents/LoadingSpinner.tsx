import { ImSpinner3 } from "react-icons/im";

const LoadingSpinner = ({ blur }: { blur?: boolean }) => {
  return (
    <div
      className={
        blur
          ? "w-full h-screen flex  items-center justify-center fixed top-0 left-0 z-[999] dark:bg-dark-gray dark:bg-opacity-70 bg-white bg-opacity-70"
          : ""
      }
    >
      <ImSpinner3 className="animate-spin text-2xl" />
    </div>
  );
};

export default LoadingSpinner;
