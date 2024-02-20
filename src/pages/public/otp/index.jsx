import styles from "./index.module.css";
import Logo from "/AllMasterslogo.jpg";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpValidation } from "../../../validations/otpValidation";
import Loader from "../../../components/loader";
import {
  useGetUnverifiedUser,
  useResendOtp,
  useVerifyOtp,
} from "../../../hooks/user";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const OTPPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(otpValidation),
    mode: "onSubmit",
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    },
  });

  const { data, isLoading } = useGetUnverifiedUser(id);
  const { mutateAsync: verifyOtp, isLoading: verifyLoading } = useVerifyOtp();
  const { mutateAsync: resendOtp, isLoading: resendLoading } = useResendOtp();

  const saveData = async (data) => {
    try {
      const postData = {};
      postData.id = id;
      postData.otp = Object.values(data).join("");
      await verifyOtp(postData);
      enqueueSnackbar("OTP Verified Successfully", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(error.messsage, {
        variant: "error",
      });
    }
  };

  const codeChangeHandler = (event) => {
    const currentId = event.target.id;
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const element = event.target;
    if (keys.includes(event.key) && currentId < 6) {
      const nextSibling = document.getElementById(`${parseInt(currentId) + 1}`);
      nextSibling ? nextSibling.focus() : element.blur();
    } else if (event.key === "Backspace" && currentId > 0) {
      const prevSibling = document.getElementById(currentId - 1);
      prevSibling ? prevSibling.focus() : element.blur();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.maindiv}>
      <div className={`container flexdiv  ${styles.otpcon}`}>
        <Form
          id="form"
          className={styles.form}
          onSubmit={handleSubmit(saveData)}
        >
          <div className={styles.Logodiv}>
            <img
              src={Logo}
              alt="AllMasters Logo"
              className={styles.masterlogo}
            />
            <h5 className="pt-2">Enter OTP</h5>
            <p>OTP sent to {data}</p>
          </div>
          <div className={styles.otplabel}>
            <Form.Label className={styles.otptxt}>
              OTP <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Link to={`/register/${id}`} className={styles.Changeemail}>
              Change Email
            </Link>
          </div>
          <div className={styles.otpdiv}>
            <Controller
              name="otp1"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  maxLength={1}
                  id="1"
                  className={styles.otp}
                  placeholder="*"
                  onKeyUp={(event) => {
                    codeChangeHandler(event);
                  }}
                />
              )}
            />
            <Controller
              name="otp2"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="2"
                  maxLength={1}
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  className={styles.otp}
                  placeholder="*"
                  onKeyUp={(event) => codeChangeHandler(event)}
                />
              )}
            />
            <Controller
              name="otp3"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="3"
                  maxLength={1}
                  className={styles.otp}
                  placeholder="*"
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  onKeyUp={(event) => codeChangeHandler(event)}
                />
              )}
            />
            <Controller
              name="otp4"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  maxLength={1}
                  id="4"
                  className={styles.otp}
                  placeholder="*"
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  onKeyUp={(event) => codeChangeHandler(event)}
                />
              )}
            />
            <Controller
              name="otp5"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  maxLength={1}
                  id="5"
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  className={styles.otp}
                  placeholder="*"
                  onKeyUp={(event) => codeChangeHandler(event)}
                />
              )}
            />
            <Controller
              name="otp6"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  maxLength={1}
                  id="6"
                  onChange={(event) =>
                    field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                  }
                  className={styles.otp}
                  placeholder="*"
                  onKeyUp={(event) => codeChangeHandler(event)}
                />
              )}
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <p className="errormsg">Enter Valid OTP</p>
          )}
          <Button
            type="submit"
            id="otpsubmit"
            disabled={verifyLoading || resendLoading}
            className={`w-100 ${styles.loginbtn}`}
            style={{ marginBottom: "5px" }}
          >
            {verifyLoading || resendLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Submit"
            )}
          </Button>
          <div className={styles.receiveotp}>
            <span>
              Didn`t Receive OTP?{" "}
              <span
                onClick={async () => {
                  try {
                    await resendOtp({ id });
                    enqueueSnackbar("OTP Resent successfully", {
                      variant: "success",
                    });
                  } catch (error) {
                    enqueueSnackbar(error.message, {
                      variant: "error",
                    });
                  }
                }}
                className={styles.forgot}
              >
                Resend
              </span>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default OTPPage;
