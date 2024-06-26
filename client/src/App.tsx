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
import PostCreate from "./pages/admin/PostCreate";
import PostEdit from "./pages/admin/PostEdit";
import Users from "./pages/admin/Users";
import UserCreate from "./pages/admin/UserCreate";
import UserEdit from "./pages/admin/UserEdit";
import RestrictedRoute from "./components/sharedComponents/RestrictedRoute";
import Dashboard from "./pages/admin/Dashboard";
import Comments from "./pages/admin/Comments";
import CommentEdit from "./pages/admin/CommentEdit";
import Contact from "./pages/Contact";

function App() {
  return (
    <div className="sm:text-sm">
      <Toaster position="bottom-right" />
      <ScrollToTop />
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/posts/:slug" element={<SinglePost />} />
          <Route path="/posts/" element={<AllPosts />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/posts/author" element={<AllPosts />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="posts" element={<DashboardPosts />} />
              <Route path="posts/create" element={<PostCreate />} />
              <Route path="posts/edit/:id" element={<PostEdit />} />
              <Route element={<RestrictedRoute />}>
                <Route path="users" element={<Users />} />
                <Route path="users/create" element={<UserCreate />} />
                <Route path="users/edit/:id" element={<UserEdit />} />
                <Route path="comments" element={<Comments />} />
                <Route path="comments/edit/:id" element={<CommentEdit />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
      <Footer />
    </div>
  );
}

export default App;
