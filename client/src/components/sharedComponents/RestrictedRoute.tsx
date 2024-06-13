import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const RestrictedRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/dashboard"} />
  );
};

export default RestrictedRoute;
