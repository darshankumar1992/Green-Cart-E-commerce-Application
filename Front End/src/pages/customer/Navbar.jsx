import React, { useEffect, useState } from "react";
import logo1 from "../../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  House,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  LeafyGreen,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

function Navbar() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (logoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [logoutModal]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoginStatus(true);
    }
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    setLoginStatus(false);
    setLogoutModal(false);
    
    navigate("/login");
  };

  const menuItemsForLogin = [
    {
      key: "chome",
      title: "Home",
      link: "/",
      icon: <House className="w-4 h-4" />,
    },
    {
      key: "cmenu",
      title: "All Product",
      link: "/all",
      icon: <LeafyGreen className="w-4 h-4" />,
    },
    {
      key: "corders",
      title: "Your Orders",
      link: "/orders",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      key: "ccart",
      title: "Cart",
      link: "/cart",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
  ];

  const menuItemsForNotLogin = [
    {
      key: "chome",
      title: "Home",
      link: "/",
      icon: <House className="w-4 h-4" />,
    },
    {
      key: "cmenu",
      title: "All Product",
      link: "/all",
      icon: <LeafyGreen className="w-4 h-4" />,
    },
    {
      key: "signin",
      title: "SignIn",
      link: "/login",
      icon: <LogIn className="w-4 h-4" />,
    },
    {
      key: "asignin",
      title: "Seller SignIn",
      link: "/alogin",
      icon: <LogIn className="w-4 h-4" />,
    },
  ];

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <>
      <div className="w-full h-[80px] px-6 flex justify-between items-center border-b-[1px] border-gray-300 bg-white relative z-50">
        
        <div className="flex items-center lg:ml-[110px]">
          <img src={logo1} width={180} height={120} alt="Logo" className="h-[60px] object-contain" />
        </div>

        {/* Hamburger icon (mobile) */}
        <Menu
          className="md:hidden cursor-pointer text-gray-700 w-6 h-6"
          onClick={handleMenuClick}
        />

        {/* Desktop menu */}
        <div className="hidden md:flex flex-row justify-end items-center gap-6 mr-[110px]">
          {loginStatus ? (
            <>
              {menuItemsForLogin.map((item) => (
                <li
                  key={item.key}
                  className={`list-none p-2 px-4 rounded-lg ${
                    location.pathname === item.link
                      ? "bg-[#4FBF8B] text-white"
                      : "text-gray-800 hover:bg-[#e0f2f1]"
                  }`}
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-1 hover:gap-2 duration-300"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li
                className="list-none p-2 px-4 rounded-lg cursor-pointer flex items-center gap-1 text-gray-700 hover:bg-[#ffecec] hover:gap-2 duration-300"
                onClick={() => setLogoutModal(true)}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </li>
            </>
          ) : (
            <>
              {menuItemsForNotLogin.map((item) => (
                <li
                  key={item.key}
                  className={`list-none p-2 px-4 rounded-lg ${
                    location.pathname === item.link
                      ? "bg-[#4FBF8B] text-white"
                      : "text-gray-800 hover:bg-[#e0f2f1]"
                  }`}
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-2 transition-all"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Mobile sidebar menu */}
      <div
        className={`fixed top-0 right-0 w-[300px] h-screen bg-white z-[999] border-l border-gray-300 p-4 transform transition-transform duration-500 ease-in-out ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <X className="cursor-pointer text-gray-700" onClick={handleMenuClick} />
        </div>

        <ul className="flex flex-col gap-4 mt-8 overflow-y-auto max-h-[85vh] pr-2">
          {loginStatus ? (
            <>
              {menuItemsForLogin.map((item) => (
                <li
                  key={item.key}
                  className={`list-none p-2 px-4 rounded-lg ${
                    location.pathname === item.link
                      ? "bg-[#4FBF8B] text-white"
                      : "text-gray-800 hover:bg-[#e0f2f1]"
                  }`}
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-1 hover:gap-2 duration-300"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li
                className="list-none p-2 px-4 rounded-lg cursor-pointer flex items-center gap-1 text-gray-700 hover:bg-[#ffecec] transition-all hover:gap-2 duration-300"
                onClick={() => setLogoutModal(true)}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </li>
            </>
          ) : (
            <>
              {menuItemsForNotLogin.map((item) => (
                <li
                  key={item.key}
                  className={`list-none p-2 px-4 rounded-lg ${
                    location.pathname === item.link
                      ? "bg-[#4FBF8B] text-white"
                      : "text-gray-800 hover:bg-[#e0f2f1]"
                  }`}
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-2 transition-all"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <section
          className="fixed inset-0 z-[999] bg-black/30 bg-opacity-50 flex justify-center items-center "
          onClick={() => setLogoutModal(false)}
        >
          <article
            className="bg-white rounded-xl p-5 w-full max-w-[350px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-800 font-medium text-center">
              Are you sure you want to logout?
            </p>

            <footer className="flex justify-center items-center mt-6 gap-4 ">
              <button
                className="px-4 py-1.5 text-sm rounded-lg border border-[#4FBF8B] text-[black] hover:bg-[#4FBF8B] transition cursor-pointer"
                onClick={() => setLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 text-sm rounded-lg bg-[black] text-[#4FBF8B] hover:bg-[#4FBF8B] hover:text-black transition cursor-pointer"
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </footer>
          </article>
        </section>
      )}
    </>
  );
}

export default Navbar;
