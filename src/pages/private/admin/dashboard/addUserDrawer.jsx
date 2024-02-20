import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserValidation } from "../../../../validations/addUserValidation";
import { AiFillEye, AiOutlineClose } from "react-icons/ai";
import { useCreateUser } from "../../../../hooks/user";
import { useState } from "react";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { useSnackbar } from "notistack";
import styles from "./index.module.css";
import LabelComponent from "../../../../components/labelComponent";
import { fileReaderFunction } from "../../../../helper";
import { CircularProgress } from "@mui/material";

function AddUserDrawer({ onCloseButtonClick }) {
  const createdBy = localStorage.getItem("allMasterId");
  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    website: "",
    position: "",
    about: "",
    companyFileName: "",
    companyFilePath: null,
    profileFileName: "",
    profileFilePath: null,
    ln: "",
    fb: "",
    insta: "",
    twitter: "",
  };
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const [confirmPasswordVisibile, setConfirmPasswordVisibile] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(addUserValidation),
    mode: "onTouched",
    defaultValues,
  });
  const { mutateAsync, isLoading } = useCreateUser();

  const watchFields = watch();

  const onSubmit = async (data) => {
    try {
      const postData = { ...data };
      postData.createdBy = createdBy;
      await mutateAsync(postData);
      enqueueSnackbar("User Created Successfully", {
        variant: "success",
      });
      reset();
      onCloseButtonClick();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

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

  async function uploadHandler(event, type) {
    event.preventDefault();
    const errorMessage = {
      NoFileError: `Upload file first`,
      fileTypeErr: `Upload only Png`,
      fileSizeErr: `Upload file under 1 MB`,
    };
    const { fileData, fileName } = await fileReaderFunction({
      fileEvent: event,
      fileType: "png",
      fileSize: 1024 * 1024,
      errorMessage,
      fileRead: "readAsDataURL",
    });
    switch (type) {
      case "profile":
        setValue("profileFileName", fileName);
        setValue("profileFilePath", fileData);
        break;
      case "companyLogo":
        setValue("companyFileName", fileName);
        setValue("companyFilePath", fileData);
        break;
      default:
        break;
    }
    event.target.value = null;
  }

  function removeUploadedFile(type) {
    switch (type) {
      case "profile":
        setValue("profileFileName", "");
        setValue("profileFilePath", null);
        break;
      case "companyLogo":
        setValue("companyFileName", "");
        setValue("companyFilePath", null);
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.add_div}>
      <div className={styles["add_div-heading"]}>
        <h3>Add User</h3>
        <button onClick={() => onCloseButtonClick()}>
          <AiOutlineClose />
        </button>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="trader">
                First Name
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="firstName"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter First Name"
              />
            )}
          />
          {errors.firstName && (
            <p className="errormsg">{errors.firstName.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="lastName">
            Last Name
          </Form.Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="lastName"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Last Name"
              />
            )}
          />
          {errors.lastName && (
            <p className="errormsg">{errors.lastName.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="trader">
                Position
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="trader"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Your Position"
              />
            )}
          />
          {errors.position && (
            <p className="errormsg">{errors.position.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="phone">
            Phone
          </Form.Label>
          <span style={{ color: "red" }}>*</span>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="phone"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Phone Number"
              />
            )}
          />
          {errors.phone && <p className="errormsg">{errors.phone.message}</p>}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="company">
                Company Name
              </Form.Label>
              <span style={{ color: "red" }}>*</span>
            </div>
          </div>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="company"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Your Company"
              />
            )}
          />
          {errors.company && (
            <p className="errormsg">{errors.company.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="website">
            Website
          </Form.Label>
          <span style={{ color: "red" }}>*</span>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="website"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Website"
              />
            )}
          />
          {errors.website && (
            <p className="errormsg">{errors.website.message}</p>
          )}
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="ln">
                Linked In
              </Form.Label>
            </div>
          </div>
          <Controller
            name="ln"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="ln"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Your linked-In"
              />
            )}
          />
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="fb">
            Facebook
          </Form.Label>
          <Controller
            name="fb"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="fb"
                className={`${styles.almostinputs} form-control  col-md-3`}
                aria-describedby="passwordHelpBlock"
                placeholder="Enter Facebook"
              />
            )}
          />
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label className={styles.almostlabels} htmlFor="Insta">
                Instagram
              </Form.Label>
            </div>
          </div>
          <Controller
            name="Insta"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="Insta"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Your Instagram"
              />
            )}
          />
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <Form.Label className={styles.almostlabels} htmlFor="twitter">
            X
          </Form.Label>
          <Controller
            name="twitter"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="twitter"
                className={`${styles.almostinputs} form-control  col-md-3`}
                placeholder="Enter Twitter"
              />
            )}
          />
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className={styles.gstdiv}>
            <div className={styles.blcopy}>
              Company Logo
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className={styles.gstfileupload}>
              <LabelComponent
                fileData={watchFields.companyFilePath}
                fileName={watchFields.companyFileName}
                type={"companyLogo"}
                removeFile={removeUploadedFile}
              />
              <input
                id="companyLogo"
                className={styles.blfileupload}
                type="file"
                accept=".png"
                onChange={(event) => uploadHandler(event, "companyLogo")}
              />
            </div>
          </div>
          <p className="errormsg">{errors?.companyFilePath?.message}</p>
        </Form.Group>
        <Form.Group className={`${styles.iconposition} pt-3`}>
          <div className={styles.gstdiv}>
            <div className={styles.blcopy}>
              Photo
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className={styles.gstfileupload}>
              <LabelComponent
                fileData={watchFields.profileFilePath}
                fileName={watchFields.profileFileName}
                type={"profile"}
                removeFile={removeUploadedFile}
              />
              <input
                id="profile"
                className={styles.blfileupload}
                accept=".png"
                type="file"
                onChange={(event) => uploadHandler(event, "profile")}
              />
            </div>
          </div>
          <p className="errormsg">{errors?.profileFilePath?.message}</p>
        </Form.Group>
        <div className="pt-3 pb-3">
          <button className={styles.savebtn}>
            {isLoading ? <CircularProgress size={20} /> : "Save User"}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default AddUserDrawer;
