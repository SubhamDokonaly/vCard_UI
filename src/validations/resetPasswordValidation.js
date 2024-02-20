import * as yup from "yup";

export const resetPasswordValidation = yup.object({
	password: yup
		.string()
		.trim()
		.required("Password is required")
		.matches(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
			"Invalid password format"
		),
	confirmPassword: yup
		.string()
		.trim()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password")], "Password does not match"),
	otp: yup.string().trim().required("Confirm OTP is required"),
});
