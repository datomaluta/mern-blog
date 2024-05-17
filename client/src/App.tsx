import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Header from "./components/sharedComponents/Header";
import Layout from "./components/sharedComponents/Layout";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/sharedComponents/ProtectedRoute";

function App() {
  return (
    <div className="sm:text-sm">
      <Toaster position="bottom-right" />
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/posts" element={<Posts />} />
          </Route>
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
