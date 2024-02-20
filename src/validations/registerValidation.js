import * as yup from "yup";

export const registerValidation = yup.object({
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
});
