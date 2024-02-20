import styles from "./index.module.css";
import Logo from "/AllMasterslogo.jpg";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { forgotPasswordValidation } from "../../../validations/forgotPasswordValidation";
import { enqueueSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { CAPTCHA_ENABLED } from "../../../config";
import { Captcha } from "../../../components/captcha";
import { useSendForgetPasswordRequest } from "../../../hooks/user";

function ForgotPassword() {
  const [captchaValue, setCaptchValue] = useState(null);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordValidation),
    mode: "onChange",
    defaultValues: {
      email: "",
      type: "",
    },
  });
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useSendForgetPasswordRequest();

  const onSubmit = async (data) => {
    try {
      if (CAPTCHA_ENABLED === "true") {
        if (!captchaValue) {
          return enqueueSnackbar("Please Enter Captcha", {
            variant: "error",
          });
        } else {
          const postData = { ...data };
          postData.captchaToken = captchaValue;
          await mutateAsync(postData);
          enqueueSnackbar(
            "Forget Password request sent successfully, Kindly check your inbox to reset your password",
            {
              variant: "success",
            }
          );
          reset();
          navigate("/login");
        }
      } else {
        await mutateAsync(data);
        enqueueSnackbar(
          "Forget Password request sent successfully, Kindly check your inbox to reset your password",
          {
            variant: "success",
          }
        );
        reset();
        navigate("/login");
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  const captchaOnChangeHandler = (value) => {
    setCaptchValue(value);
  };

  return (
    <div className={styles.maindiv}>
      <div className="container flexdiv">
        <div className={styles.newuser}>
          <p>
            Are you new here ?{" "}
            <button
              type="button"
              className={styles.forgot}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>
        <Form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.Logodiv}>
            <img
              src={Logo}
              alt="AllMasters Logo"
              className={styles.masterlogo}
            />
            <h5 className="pt-2">Reset Password</h5>
            <p>& take back control now</p>
          </div>
          <div className="form-group pt-2 pb-3">
            <Form.Group className="pt-2">
              <Form.Label htmlFor="type" className="formlabel">
                Type <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Form.Select
                    {...field}
                    type="number"
                    id="type"
                    className="formcontrol"
                  >
                    <option hidden>Select Type</option>
                    <option value="1">I am a Employee</option>
                    <option value="2">I am an Administrator</option>
                  </Form.Select>
                )}
              />
              {errors.type && (
                <span className="error">{errors.type.message}</span>
              )}
            </Form.Group>
            <Form.Label htmlFor="InputEmail">
              Email Address <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="InputEmail"
                  className="form-control col-md-3"
                  aria-describedby="Enter email address block"
                  placeholder="Enter Email Address"
                />
              )}
            />
            {errors.email && <p className="errormsg">{errors.email.message}</p>}
          </div>
          <div className="pt-1">
            <Captcha onChange={captchaOnChangeHandler} />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className={styles.loginbtn}
            id="Resetbtn"
          >
            {isLoading ? <CircularProgress size={20} /> : "Reset Password"}
          </Button>
          <Link to="/login" className={styles.goback}>
            Go back
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
