import { useParams } from "react-router-dom";
import { useGetUserData } from "../../../hooks/user";
import Loader from "../../../components/loader";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import "./index.css";
import {
  MdAlternateEmail,
  MdOutlineShare,
  MdSave,
  MdWhatsapp,
} from "react-icons/md";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { Avatar, Fab, Menu, MenuItem } from "@mui/material";

export default function User() {
  const { id } = useParams();
  const { data, isLoading } = useGetUserData(id);
  const {
    firstName = "",
    lastName = "",
    company = "",
    companyFilePath = "",
    profileFilePath = "",
    phone = "",
    position = "",
    ln = "",
    fb = "",
    insta = "",
    twitter = "",
    email = "",
  } = isLoading ? {} : data;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [anchroEl, setAnchorEl] = useState(null);
  const open = Boolean(anchroEl);

  function optionHandle(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function saveContactCard() {
    const vcard = `BEGIN:VCARD
VERSION:2.1
N:;${firstName};;;
FN:${firstName} ${lastName}
ORG:${company}
ADR:;3rd Floor, Ispahani Centre, 123, 124 Nungambakkam High Road, Chennai 600034;;;;
TEL;CELL;VOICE:${phone}
TEL;TYPE=CELL:
EMAIL:${email}
TITLE:${position}
item1.URL:https://allmasters.ai
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contact.vcf`;
    link.click();
    handleClose();
  }

  async function convertToBlobUrl(filePath) {
    const responseData = await fetch(filePath);
    const blobData = await responseData.blob();
    const blobUrl = URL.createObjectURL(blobData);
    setBackgroundImage(blobUrl);
  }

  useEffect(() => {
    convertToBlobUrl(companyFilePath);
  }, [companyFilePath]);

  if (isLoading || companyFilePath == null) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.maindiv}>
        <div className={styles.flexdiv}>
          <div className={styles.imgdiv}>
            <Avatar
              src={profileFilePath}
              sx={{
                height: "150px",
                width: "150px",
              }}
              className={styles.img}
              alt={firstName}
            />
          </div>
          <div
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
            className={styles.contantdiv}
          >
            <div className={styles.contant}>
              <div className={styles.contanttxt}>
                <div className={styles.text}>
                  <p className={styles.name}>{`${firstName} ${lastName}`}</p>
                  <p className={styles.title}>{position}</p>
                </div>
                <div className={styles.detailsmaindiv}>
                  <div className={styles.detailcard}>
                    <p className={styles.usertitle}>Phone : </p>
                    <p className={styles.emailtxt}>{phone}</p>
                  </div>
                  <div className={styles.detailcard}>
                    <p className={styles.usertitle}>Email : </p>
                    <p className={styles.emailtxt}>{email}</p>
                  </div>
                  <div className={styles.detailcard}>
                    <p className={styles.usertitle}>Address : </p>
                    <p className={styles.emailtxt}>
                      3rd Floor, Ispahani Centre, 123, 124 Nungambakkam High
                      Road, Chennai 600034
                    </p>
                  </div>
                  <div className={styles.detailcard}>
                    <p className={styles.usertitle}>Company : </p>
                    <p className={styles.emailtxt}>All Masters</p>
                  </div>
                  <div className={styles.detailcard}>
                    <p className={styles.usertitle}>Website : </p>
                    <p className={styles.emailtxt}>https://allmasters.ai</p>
                  </div>
                </div>
                <div className={styles.footer}>
                  <div id="icons">
                    <a href={`mailto:${email}`} className={styles.ico}>
                      <MdAlternateEmail color="#f3cf00" />
                    </a>
                    {ln?.length > 0 && (
                      <a href={`/${ln}`} className={styles.ico}>
                        <FaLinkedin color="#f3cf00" />
                      </a>
                    )}
                    {fb?.length > 0 && (
                      <a href={`/${fb}`} className={styles.ico}>
                        <FaFacebook color="#f3cf00" />
                      </a>
                    )}
                    {insta?.length > 0 && (
                      <a href={`/${fb}`} className={styles.ico}>
                        <FaInstagram color="#f3cf00" />
                      </a>
                    )}
                    {twitter?.length > 0 && (
                      <a href={`/${twitter}`} className={styles.ico}>
                        <FaTwitter color="#f3cf00" />
                      </a>
                    )}
                    <a href={`https://wa.me/${phone}`} className={styles.ico}>
                      <MdWhatsapp color="#f3cf00" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Fab
        color="primary"
        sx={{
          position: "absolute",
          bottom: 0,
          color: "white",
          backgroundColor: "#f3cf00",
          right: 0,
        }}
        aria-label="share"
        onClick={(event) => optionHandle(event)}
      >
        <MdOutlineShare />
      </Fab>
      <Menu anchorEl={anchroEl} open={open} onClose={() => handleClose()}>
        <MenuItem
          sx={{
            display: "flex",
            gap: "10px",
          }}
          onClick={() => saveContactCard()}
        >
          <MdSave />
          <span>Save to Contact</span>
        </MenuItem>
      </Menu>
    </>
  );
}
