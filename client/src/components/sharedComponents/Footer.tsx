import { MdOutlineEmail } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import mobileLogo from "./../../assets/images/mobileLogo.png";
import mobileLogoWhite from "./../../assets/images/mobileLogoWhite.png";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Footer = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { pathname } = useLocation();

  return (
    <>
      {pathname.includes("dashboard") ? (
        <></>
      ) : (
        <footer className="dark:bg-dark-gray-shade bg-white-shade sticky top-0 1 pt-16 lg:pt-4 pb-6 lg:pb-4 md:py-4 z-30">
          <div
            className={`relative xl:px-4 md:px-3 w-full 
     md:text-sm max-w-[75.3rem] mx-auto`}
          >
            <div className="flex justify-between gap-3 w-full border-b dark:border-zinc-700 border-zinc-300 pb-9 lg:hidden">
              <div className="max-w-[280px]">
                <h3 className="mb-2">About</h3>
                <p className="text-dark-text-gray text-sm">
                  Welcome to MetaBlog, where we share insights and stories. Join
                  us for the latest trends and inspiration. Let's explore
                  together!
                </p>
                <ul className="mt-6 text-sm">
                  <li>
                    Email:{" "}
                    <em className="text-dark-text-gray">
                      metablog@example.com
                    </em>
                  </li>
                  <li>
                    Phone:{" "}
                    <em className="text-dark-text-gray">(123) 456-7890</em>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2">Quick link</h3>
                <ul className="flex flex-col gap-3 text-sm text-dark-text-gray">
                  <li>
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link to={"/"}>All posts</Link>
                  </li>
                  <li>
                    <Link to={"/"}>About</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2">Category</h3>
                <ul className="flex flex-col gap-3 text-sm text-dark-text-gray">
                  <li>
                    <Link to={"/"}>Lifestyle</Link>
                  </li>
                  <li>
                    <Link to={"/"}>Travel</Link>
                  </li>
                  <li>
                    <Link to={"/"}>Business</Link>
                  </li>
                  <li>
                    <Link to={"/"}>Sports</Link>
                  </li>
                </ul>
              </div>
              <div className="dark:bg-dark-gray-tint bg-white p-6 rounded-xl shrink-0">
                <h3 className="text-center text-lg">Weakly Newsletter</h3>
                <p className="text-sm text-center mt-1 mb-7 text-dark-text-gray">
                  Get blog articles and offers via email
                </p>

                <div className="relative max-w-80 sm:max-w-full w-full mb-4">
                  <MdOutlineEmail className="icon-of-input" />
                  <input
                    className="input-with-no-bg pl-10 "
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <button className="submit-button !bg-light-purple !text-white">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-between items-center md:flex-col md:gap-4">
              <div className="flex gap-2 items-center md:flex-col">
                <img
                  src={theme === "light" ? mobileLogo : mobileLogoWhite}
                  alt="logo"
                  className="block"
                />
                <div className="text-sm md:text-center">
                  <p>
                    Meta<span className="font-bold">Blog</span>
                  </p>
                  <p className="text-dark-text-gray md:mt-1">
                    © 2024 Meta. All Rights Reserved
                  </p>
                </div>
              </div>
              <ul className="flex gap-4 md:gap-2 text-sm text-dark-text-gray">
                <li className="text-center">Terms of use</li>
                <li className="text-center">Privacy policy</li>
                <li className="text-center">Cookie policy</li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
