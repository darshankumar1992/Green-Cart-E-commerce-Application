import React, { useEffect, useState } from "react";
import logo1 from "../../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  House,
  LogOut,
  SquarePlus,
  ShoppingBag,
  SquareUserRound,
  LeafyGreen,
} from "lucide-react";


function ANavbar() {
  const [loginStatus, setLoginStatus] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoginStatus(true);
    }
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("admin");
    toast.success("Logged out successfully");
    setLoginStatus(false);
    navigate("/login");
  };

  const menuItemsForLogin = [
    {
      key: "adash",
      title: "Dashboard",
      link: "/admin",
      icon: <House className="w-4 h-4" />,
    },
    {
      key: "add",
      title: "Add Product",
      link: "/admin/add",     
      icon: <SquarePlus className="w-4 h-4" />,
    },
    {
      key: "all",
      title: "All Products",
      link: "/admin/all",     
      icon: <LeafyGreen className="w-4 h-4" />,
    },
    {
      key: "orders",
      title: "Orders",
      link: "/admin/orders",  
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      key: "customer",
      title: "Customer",
      link: "/admin/customer", 
      icon: <SquareUserRound className="w-4 h-4" />,
    },
    {
      key: "logout",
      title: "Logout",
      link: "#",
      icon: <LogOut className="w-4 h-4" />,
      action: handleLogoutConfirm,
    },
  ];

  return (
    <>
      

      {/* Side Menu */}
      <div className="md:w-72 w-16 border-r h-[100vh] text-base border-gray-300 pt-6 flex flex-col transition-all duration-300 bg-white">
        {menuItemsForLogin.map((item) => {
          const isActive = location.pathname === item.link;

          if (item.key === "logout") {
            return (
              <button
                key={item.key}
                onClick={item.action}
                className="flex items-center py-5 px-6 gap-5 text-left w-full hover:bg-gray-100/90 text-gray-800"
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </div>
                <p className="md:block hidden text-lg font-semibold">
                  {item.title}
                </p>
              </button>
            );
          }

          return (
            <Link
              to={item.link}
              key={item.key}
              className={`flex items-center py-5 px-6 gap-5 ${
                isActive
                  ? "border-r-4 md:border-r-[6px] border-[#4FBF8B] bg-[#E6FFF6]"
                  : "hover:bg-gray-100/90 border-white text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center w-6 h-6">
                {item.icon}
              </div>
              <p className="md:block hidden text-lg font-semibold">{item.title}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default ANavbar;
