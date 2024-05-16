import DashboardLayout from "../components/sharedComponents/DashboardLayout";
import { Link, useLocation } from "react-router-dom";
import GeneralUserForm from "../components/profileComponents/GeneralUserForm";
import PasswordChangeForm from "../components/profileComponents/PasswordChangeForm";

const Profile = () => {
  const location = useLocation();
  const activeTab = new URLSearchParams(location.search).get("tab");

  return (
    <DashboardLayout>
      <div className="border border-zinc-500 rounded max-w-2xl">
        <div className="flex gap-4 p-3">
          <Link
            to={"/dashboard/profile?tab=general"}
            className={`${
              activeTab === "general" && "dark:border-white border-zinc-500"
            } border-b border-transparent pb-1`}
          >
            General
          </Link>
          <Link
            to={"/dashboard/profile?tab=security"}
            className={`${
              activeTab === "security" && "dark:border-white border-zinc-500"
            } border-b border-transparent pb-1`}
          >
            Security
          </Link>
        </div>
        {activeTab === "general" && <GeneralUserForm />}
        {activeTab === "security" && <PasswordChangeForm />}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
