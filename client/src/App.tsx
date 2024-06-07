import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Header from "./components/sharedComponents/Header";
import Layout from "./components/sharedComponents/Layout";
import SignIn from "./pages/SignIn";
import Profile from "./pages/admin/Profile";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/sharedComponents/ProtectedRoute";
import DashboardLayout from "./components/sharedComponents/DashboardLayout";
import ResetPassword from "./pages/ResetPassword";
import Footer from "./components/sharedComponents/Footer";
import SinglePost from "./pages/SinglePost";
import ScrollToTop from "./components/ui/ScrollToTop";
import AllPosts from "./pages/AllPosts";
import DashboardPosts from "./pages/admin/DashboardPosts";
import "./style/pagination.css";

function App() {
  return (
    <div className="sm:text-sm">
      <Toaster position="bottom-right" />
      <ScrollToTop />
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/posts/:slug" element={<SinglePost />} />
          <Route path="/posts/" element={<AllPosts />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="posts" element={<DashboardPosts />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
      <Footer />
    </div>
  );
}

export default App;
