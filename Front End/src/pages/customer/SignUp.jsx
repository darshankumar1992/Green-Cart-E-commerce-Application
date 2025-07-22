import React, { useState } from 'react';
import { ErrorMessage, Form, Formik } from "formik";
import { customerSignupValidation } from '../../formik/FormValidation';
import {
  Eye, EyeOff, User, Mail, MapPin, Phone, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const addSignUpData = async(data)=>{
    const response = await axios.post(serverUrl+"auth/user/register",data);
    return response.data;
  }

  const signUpMutation = useMutation({
    mutationKey:"customer-signup",
    mutationFn:addSignUpData,
    onSuccess:(data)=>{
        const {token}=data;
        localStorage.setItem("token",token);
        toast.success("Account Created Successfully")
    },
    onError:(error)=>{
        console.error(error)
        toast.error(getErrorMessage(error));
    }
  })



  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-[350px] bg-white border border-gray-300 rounded-2xl shadow-lg px-6 py-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <Formik
          initialValues={{
            name: "",
            email: "",
            address: "",
            password: "",
            cpassword: "",
            phoneNumber: ""
          }}
          validationSchema={customerSignupValidation}
          onSubmit={(val)=>{
            signUpMutation.mutate(val)
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
                <span className="text-[#4FBF8B]">User</span> Sign Up
              </h2>

              {/* Name */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </div>
                <ErrorMessage name="name" component="p" className="text-sm text-red-500" />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Mobile"
                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue) && newValue.length <= 10) {
                        handleChange(e);
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.phoneNumber}
                  />
                </div>
                <ErrorMessage name="phoneNumber" component="p" className="text-sm text-red-500" />
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                  />
                </div>
                <ErrorMessage name="address" component="p" className="text-sm text-red-500" />
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </span>
                <ErrorMessage name="password" component="p" className="text-sm text-red-500" />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="cpassword"
                    placeholder="Confirm Password"
                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:border-[#4FBF8B] focus:outline-none"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cpassword}
                  />
                </div>
                {values.password && values.password === values.cpassword && (
                  <p className="text-sm text-green-600">Password Matched</p>
                )}
                <ErrorMessage name="cpassword" component="p" className="text-sm text-red-500" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#4FBF8B] cursor-pointer text-white font-semibold py-2 rounded-xl mt-2 hover:bg-[#45a07a] transition"
              >
                Sign Up
              </button>

              {/* Divider */}
              <div className="mt-2 flex justify-start items-center w-full  text-slate-700">
                <hr className="flex-1" /><span className="text-[0.5rem] px-2">OR</span><hr className="flex-1" />
              </div>

              {/* Sign In Redirect */}
              <p className="mt-2 text-center w-full text-[13px]  text-slate-700">
                Already have an account?{" "}
                <span className="cursor-pointer text-[#4FBF8B]" onClick={handleSignInClick}>
                  Sign In
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
