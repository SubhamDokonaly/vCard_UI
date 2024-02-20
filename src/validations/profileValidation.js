import * as yup from "yup";

export const profileValidation = ({
  company: companyUpdate,
  profile: profileUpdate,
}) =>
  yup.object({
    firstName: yup.string().trim().required("First Name is required"),
    lastName: yup.string().trim().required("Last Name is required"),
    phone: yup.string().trim().required("Phone Number is required"),
    company: yup.string().trim().required("Company Name is required"),
    website: yup.string().required("Website is required"),
    position: yup.string().required("Position is required"),
    about: yup.string(),
    companyFileName: yup.string().when([], {
      is: () => companyUpdate === true,
      then: (schema) => schema.required("Please Upload company picture"),
    }),
    companyFilePath: yup.string().when([], {
      is: () => companyUpdate === true,
      then: (schema) =>
        schema
          .required("Please Upload company picture")
          .nonNullable("Please Upload company picture"),
    }),
    profileFileName: yup.string().when([], {
      is: () => profileUpdate === true,
      then: (schema) =>
        schema
          .required("Please Upload profile picture")
          .nonNullable("Please Upload profile picture"),
    }),
    profileFilePath: yup.string().when([], {
      is: () => profileUpdate === true,
      then: (schema) =>
        schema
          .required("Please Upload profile picture")
          .nonNullable("Please Upload profile picture"),
    }),
    ln: yup.string().trim(),
    fb: yup.string().trim(),
    insta: yup.string().trim(),
    twitter: yup.string().trim(),
  });
