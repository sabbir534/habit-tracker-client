import { Outlet } from "react-router";

import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto flex-1">
        <div className="pt-4">
          <Outlet />
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
