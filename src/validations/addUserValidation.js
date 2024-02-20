import * as yup from "yup";

export const addUserValidation = yup.object({
  email: yup
    .string()
    .email("Enter valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
      "Invalid Password format"
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Password does not match"),
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  phone: yup.string().trim().required("Phone Number is required"),
  company: yup.string().trim().required("Company Name is required"),
  website: yup.string().required("Website is required"),
  position: yup.string().required("Position is required"),
  about: yup.string(),
  companyFileName: yup.string().required("Please Upload company picture"),
  companyFilePath: yup
    .string()
    .required("Please Upload company picture")
    .nonNullable("Please Upload company picture"),
  profileFileName: yup
    .string()
    .required("Please Upload profile picture")
    .nonNullable(),
  profileFilePath: yup
    .string()
    .required("Please Upload profile picture")
    .nonNullable("Please Upload profile picture"),
  ln: yup.string().trim(),
  fb: yup.string().trim(),
  insta: yup.string().trim(),
  twitter: yup.string().trim(),
});

export const addProductValidation = yup.object({
  name: yup.string().trim().required("Name is required"),
  brand: yup.string().trim().required("Brand is required"),
  price: yup.string().trim().required("Price is required"),
  discount: yup.string().trim(),
  description: yup.string().trim(),
  // companyFilePath: yup
  //   .string()
  //   .required("Please Upload company picture")
  //   .nonNullable("Please Upload company picture"),
  // profileFileName: yup
  //   .string()
  //   .required("Please Upload profile picture")
  //   .nonNullable(),
  // profileFilePath: yup
  //   .string()
  //   .required("Please Upload profile picture")
  //   .nonNullable("Please Upload profile picture"),
});
