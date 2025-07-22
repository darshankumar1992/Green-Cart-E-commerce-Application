import * as Yup from 'yup';
export const customerLoginValidation = Yup.object().shape({
    email:Yup.string()
          .email("Invaild Email!")
          .required("Email Required!"),
    password:Yup.string()
             .required("Password Required!")
})

export const customerSignupValidation = Yup.object().shape({
      name: Yup.string().required("Required!"),
      email: Yup.string().required("Required").email("Invalid Email"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
      address: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      cpassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
})




