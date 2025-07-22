import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import logo1 from "../../assets/logo.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { serverUrl } from "../../utils/Infos";
import ANavbar from "./ANavbar";

const fetchCustomerData = async () => {
  const response = await axiosInstance.get(`${serverUrl}auth/admin/aprofile`);
  console.log(response.data);
  return response.data;
};

const AWrapper = () => {
  const token = localStorage.getItem("token");

  const {
    data: aprofile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["aprofile"],
    queryFn: fetchCustomerData,
    enabled: !!token, // fetch only if token is available
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (aprofile) {
      sessionStorage.setItem("admin", JSON.stringify(aprofile));
      console.log("Admin profile stored in session:", aprofile);
    }
  }, [aprofile]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch user profile:", error);
    }
  }, [isError, error]);

  return (
    <>
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-4 bg-white transition-all duration-300">
        <Link to="/">
          <img className="h-10" src={logo1} alt="Logo" />
        </Link>
        <div className="flex items-center gap-5 text-gray-600">
          <p className="text-lg font-medium mr-[20px]">Hi! Admin</p>
        </div>
      </div>

    <div className="flex"> 
      <ANavbar />
      <div className="flex-1  p-4">
        <Outlet /> {/* Renders AHome, Addproduct, etc */}
      </div>
    </div>

    </>
  );
};

export default AWrapper;
