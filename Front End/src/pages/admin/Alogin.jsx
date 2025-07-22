import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { getErrorMessage,serverUrl } from "../../utils/Infos";
import axios from "axios";
import logo from "../../assets/logo.svg";
import fruit1 from "../../assets/fruit1.jpg"
import { customerLoginValidation } from "../../formik/FormValidation";
import toast from "react-hot-toast";

function Alogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const userSignIn = async (val) => {
    const response = await axios.post(serverUrl+"auth/admin/login",val);
    return response.data;
  };

  const signInMutation = useMutation({
    mutationKey: ["customer-signIn"],  
    mutationFn: userSignIn,
    onSuccess: (data) => {
      const { token } = data;
      console.log(data);
      localStorage.setItem("token", token);
      sessionStorage.removeItem("user");
      toast.success("SignIn Successfully");

     setTimeout(() => {
          navigate("/admin");
      }, 800);
    },
    onError: (error) => {
      console.error(error);
      toast.error(getErrorMessage(error)); // Display error message
    },
  });
  

  
  

  return (
    <div className="w-full h-screen  flex  justify-center items-center ">
      <div className="h-[500px] w-[90%] max-w-[800px] border-2 border-gray-300 rounded-2xl shadow-lg flex justify-center items-center gap-[30px] bg-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] flex-col md:flex-row">



      <div className="hidden md:flex w-full md:w-[300px] h-[300px] md:h-[500px] flex-col justify-center items-center">

            <div>
                <img src={logo} className="w-[150px]"></img>
            </div>
            <div>
                <img src={fruit1} className="w-[220px]"></img>
            </div>
            <div>
                <p className="text-[13px] text-center"> Login to access fresh produce recommendations, and fruit and vegetable ordering.</p>
            </div>
      </div>
      
      <div className="hidden md:block h-[60%] w-[2px] bg-gray-300"></div>

      <div className="w-[90%] sm:w-[350px] h-[500px] flex flex-col">

        <Formik   // form handling & validation
              initialValues={{ email: "", password: "" }}
              validationSchema={customerLoginValidation}
              onSubmit={(val) => {
                signInMutation.mutate(val)
              }}
            >
              {({// Destructuring Formik Props
                handleChange,  // updates the value when typed in a field
                handleBlur,
                values,        // current values of all fields
                touched,
                errors,
                isValid,      // true if form passes validation
              }) => (

                <Form>
                    <div className="text-2xl text-center mt-[90px] font-medium text-gray-600"><span className="text-[#4FBF8B] text-2xl">Admin</span> Login</div>
                        <div className="w-full flex flex-col justify-start items-center mt-[40px]">
                          <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="border border-gray-300 rounded-xl p-2 w-[80%] text-[0.9rem] placeholder:text-[0.9rem] focus:border-[#4FBF8B] focus:outline-none"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                          <ErrorMessage
                            name="email"
                            className="text-[0.7rem] text-red-500"
                            component={"p"}  //tag name to print the data
                          />
                        </div>

                     <div className="w-full flex flex-col justify-start items-center mt-[20px] relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="border border-gray-300 rounded-xl p-2 w-[80%] pe-4 text-[0.9rem] placeholder:text-[0.9rem] focus:border-[#4FBF8B] focus:outline-none"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        <span className="absolute right-[45px] top-[50%] translate-y-[-50%]  my-auto">
                        {!showPassword ? (
                          <Eye
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        ) : (
                          <EyeOff
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        )}
                      </span>
                        <ErrorMessage
                          name="password"
                          className="text-[0.7rem] text-red-500"
                          component={"p"}
                        />
                      </div>


                     <div className="w-full flex justify-center items-center mt-[30px]">
                      <button type="submit"
                         className={`w-[80%] mx-auto bg-[#4FBF8B] text-white py-2 rounded-2xl  flex justify-center items-center cursor-pointer ${!isValid && "cursor-not-allowed"}`}
                      >Login</button>

                     </div>

                      
                   

               
                </Form>

                     

              )}
            </Formik>
            </div>
      </div>
        

    </div>
  );
}
export default Alogin