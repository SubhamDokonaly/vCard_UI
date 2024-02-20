import styles from "./index.module.css";
import Logo from "/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../../validations/registerValidation";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Loader from "../../../components/loader";
import { CAPTCHA_ENABLED } from "../../../config";
import { Captcha } from "../../../components/captcha";
import {
  useGetUnverifiedUser,
  useRegisterUser,
  useUpdateUnverifiedUser,
} from "../../../hooks/user";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

function Register() {
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const [confirmPasswordVisibile, setConfirmPasswordVisibile] = useState(false);
  const [captchaValue, setCaptchValue] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(registerValidation),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isSuccess } = useGetUnverifiedUser(id);
  const { mutateAsync: register, isLoading: registerLoading } =
    useRegisterUser();
  const { mutateAsync: update, isLoading: updateLoading } =
    useUpdateUnverifiedUser();

  const togglePasswordVisiblity = (type) => {
    switch (type) {
      case "password":
        setPasswordVisibile(!passwordVisibile);
        break;
      case "confirmPassword":
        setConfirmPasswordVisibile(!confirmPasswordVisibile);
        break;
      default:
        break;
    }
  };

  const preventEvents = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      const postData = { ...data };
      if (CAPTCHA_ENABLED === "true") {
        if (!captchaValue) {
          return enqueueSnackbar("Please Enter Captcha", {
            variant: "error",
          });
        } else {
          if (id) {
            postData.id = id;
            postData.captchaToken = captchaValue;
            await update(postData);
            enqueueSnackbar("User details updated Successfully", {
              variant: "success",
            });
            navigate(`/otp/${id}`);
          } else {
            postData.captchaToken = captchaValue;
            const responseData = await register(postData);
            enqueueSnackbar("User Registered Successfully", {
              variant: "success",
            });
            navigate(`/otp/${responseData.data}`);
          }
        }
      } else {
        if (id) {
          postData.id = id;
          await update(postData);
          enqueueSnackbar("User details updated Successfully", {
            variant: "success",
          });
          navigate(`/otp/${id}`);
        } else {
          const responseData = await register(postData);
          enqueueSnackbar("User Registered Successfully", {
            variant: "success",
          });
          navigate(`/otp/${responseData.data}`);
        }
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset({
        email: data,
        password: "",
        confirmPassword: "",
      });
    }
  }, [data, isSuccess, reset]);

  const captchaOnChangeHandler = (value) => {
    setCaptchValue(value);
  };

  if (isLoading || registerLoading || updateLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.maindiv}>
      <div className="container flexdiv">
        <div className={styles.newuser}>
          <p>
            Already have an account ?{" "}
            <Link to="/login" className={styles.forgot}>
              Login
            </Link>
          </p>
        </div>

        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.Logodiv}>
            <img
              src={Logo}
              alt="AllMasters Logo"
              className={styles.masterlogo}
            />
          </div>
          <Form.Group className="pt-2">
            <Form.Label htmlFor="email" className={styles.registerlabels}>
              Email Address <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="email"
                  id="email"
                  className="form-control col-md-3"
                  placeholder="Enter Email Address"
                  autoComplete="new-password"
                />
              )}
            />
            {errors.email && <p className="errormsg">{errors.email.message}</p>}
          </Form.Group>
          <Form.Group className={`${styles.iconposition} pt-2`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Form.Label htmlFor="Password" className={styles.registerlabels}>
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type={passwordVisibile ? "text" : "password"}
                  id="Password"
                  className="form-control col-md-3"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  onCut={preventEvents}
                  onCopy={preventEvents}
                  onPaste={preventEvents}
                />
              )}
            />
            <div
              className={styles.passicons}
              onClick={() => {
                togglePasswordVisiblity("password");
              }}
            >
              {passwordVisibile ? <BsFillEyeSlashFill /> : <AiFillEye />}
            </div>
            {errors.password && (
              <p className="errormsg">{errors.password.message}</p>
            )}
          </Form.Group>
          <Form.Group className={`${styles.iconposition} pt-2`}>
            <div className="d-flex justify-content-between">
              <Form.Label
                htmlFor="ConfirmPassword"
                className={styles.registerlabels}
              >
                Confirm Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
            </div>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type={confirmPasswordVisibile ? "text" : "password"}
                  id="ConfirmPassword"
                  className="form-control col-md-3"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  onCut={preventEvents}
                  onCopy={preventEvents}
                  onPaste={preventEvents}
                />
              )}
            />
            <div
              className={styles.passicons}
              onClick={() => {
                togglePasswordVisiblity("confirmPassword");
              }}
            >
              {confirmPasswordVisibile ? <BsFillEyeSlashFill /> : <AiFillEye />}
            </div>
            {errors.confirmPassword && (
              <p className="errormsg">{errors.confirmPassword.message}</p>
            )}
          </Form.Group>
          <div className="pt-3">
            <Captcha onChange={captchaOnChangeHandler} />
          </div>

          <Button
            disabled={registerLoading || updateLoading}
            type="submit"
            id="Signin"
            className={`${styles.loginbtn} w-100`}
          >
            {registerLoading || updateLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Get Started"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
