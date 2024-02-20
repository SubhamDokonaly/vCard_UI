import styles from "./index.module.css";
import Logo from "/AllMasterslogo.jpg";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileValidation } from "../../../validations/profileValidation";
import { Controller, useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { fileReaderFunction } from "../../../helper";
import { useGetUserData, useUpdateUserData } from "../../../hooks/user";
import { useSnackbar } from "notistack";
import LabelComponent from "../../../components/labelComponent";
import Loader from "../../../components/loader";
import { useEffect, useState } from "react";
import ShowLinkModal from "../../../components/showLinkModal";
import ShowQRModal from "../../../components/showQRModal";
import { useDispatch } from "react-redux";
import { openLinkPopup, openQRPopup } from "../../../redux/slices/popupSlice";
import { CircularProgress } from "@mui/material";

function Profile() {
  const defaultValues = {
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
  const userId = localStorage.getItem("allMasterId");
  const userURL = `${window.location.origin}/user/${userId}`;
  const [pictureUpdate, setPictureUpdate] = useState({
    company: false,
    profile: false,
  });
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(profileValidation(pictureUpdate)),
    mode: "onTouched",
    defaultValues,
  });

  const watchFields = watch();
  const { data, isLoading, isSuccess } = useGetUserData();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { mutateAsync, isLoading: updateLoading } = useUpdateUserData();

  function handlePopupOpen(type) {
    switch (type) {
      case "qr":
        dispatch(openQRPopup());
        break;
      case "link":
        dispatch(openLinkPopup());
        break;
      default:
        break;
    }
  }

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

  async function onSubmit(data) {
    try {
      const postData = { ...data };
      postData.id = localStorage.getItem("allMasterId");
      await mutateAsync(postData);
      enqueueSnackbar("Details Updated Successfully", {
        variant: "success",
      });
      setPictureUpdate({
        company: false,
        profile: false,
      });
      reset();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  }

  useEffect(() => {
    function checkDataForPicture(data) {
      const { companyFilePath = null, profileFilePath = null } = data ?? {};
      if (companyFilePath === null && profileFilePath === null) {
        setPictureUpdate({
          company: true,
          profile: true,
        });
      } else if (companyFilePath === null && profileFilePath != null) {
        setPictureUpdate({
          ...pictureUpdate,
          company: true,
        });
      } else if (companyFilePath != null && profileFilePath === null) {
        setPictureUpdate({
          ...pictureUpdate,
          profile: true,
        });
      } else {
        return;
      }
    }
    if (
      isSuccess &&
      pictureUpdate.company === false &&
      pictureUpdate.profile === false
    ) {
      checkDataForPicture(data);
    }
  }, [data, isSuccess, pictureUpdate]);

  useEffect(() => {
    if (isSuccess) {
      const {
        firstName = "",
        lastName = "",
        phone = "",
        company = "",
        website = "",
        position = "",
        about = "",
        ln = "",
        fb = "",
        insta = "",
        twitter = "",
      } = data;
      reset({
        firstName,
        lastName,
        phone,
        company,
        website,
        position,
        about,
        ln,
        fb,
        insta,
        twitter,
      });
    }
  }, [data, isSuccess, reset]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`container ${styles.flexdiv} pb-5`} id="disclaimerdiv">
      <div className={styles.newuser}>
        <p>
          Want to fill afterwards ?{" "}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.replace("/login");
            }}
            className={styles.forgot}
          >
            Logout
          </button>
        </p>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.almostdiv}>
          <img src={Logo} alt="AllMasters Logo" className={styles.masterlogo} />
          <h5 className="pt-2">Personal Details</h5>
          <button
            type="button"
            className={styles.qrButton}
            onClick={() => handlePopupOpen("qr")}
          >
            Generate QR
          </button>
          <button
            type="button"
            className={styles.qrButton}
            onClick={() => handlePopupOpen("link")}
          >
            Show Link
          </button>
          <a
            href={userURL}
            target="_blank"
            className={`${styles.qrButton} text-decoration-none`}
            rel="noreferrer"
          >
            Preview
          </a>
        </div>
        <div className={styles.traderdiv}>
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
        </div>
        <div className={styles.traderdiv}>
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
        </div>
        <div className={styles.traderdiv}>
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
        </div>
        <div className={styles.traderdiv}>
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
        </div>
        <div className={styles.traderdiv}>
          <Form.Group className={`${styles.iconposition} pt-3`}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <Form.Label className={styles.almostlabels} htmlFor="insta">
                  Instagram
                </Form.Label>
              </div>
            </div>
            <Controller
              name="insta"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="insta"
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
        </div>
        <div className={styles.traderdiv}>
          {pictureUpdate.company ? (
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
          ) : (
            data?.companyFilePath != null && (
              <div className="m-2">
                <div className="d-flex gap-2">
                  <div>Company Logo</div>
                  <button
                    className={styles.forgot}
                    type="button"
                    onClick={() =>
                      setPictureUpdate({ ...pictureUpdate, company: true })
                    }
                  >
                    Update Logo
                  </button>
                </div>
                <img
                  style={{ height: "150px", width: "270px" }}
                  src={data.companyFilePath}
                  alt="Company Logo"
                />
              </div>
            )
          )}
          {pictureUpdate.profile ? (
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
          ) : (
            data?.profileFilePath != null && (
              <div className="m-2">
                <div className="d-flex gap-2">
                  <div>Profile Picture</div>
                  <button
                    className={styles.forgot}
                    type="button"
                    onClick={() =>
                      setPictureUpdate({ ...pictureUpdate, profile: true })
                    }
                  >
                    Update Picture
                  </button>
                </div>
                <img
                  style={{ height: "150px", width: "270px" }}
                  src={data.profileFilePath}
                  alt="Profile Picture"
                />
              </div>
            )
          )}
        </div>
        <Button
          type="submit"
          disabled={updateLoading}
          id="Continuebtn"
          className={`${styles.loginbtn} w-100`}
        >
          {updateLoading ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </Form>
      <ShowLinkModal />
      <ShowQRModal />
    </div>
  );
}

export default Profile;
