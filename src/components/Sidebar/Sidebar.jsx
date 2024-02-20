import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { ReactComponent as RateIcon } from "../../assets/Icons/rate.svg";
// import { ReactComponent as LaneIcon } from "../../assets/Icons/lane.svg";
// import { ReactComponent as SchedulesIcon } from "../../assets/Icons/schedules.svg";
// import { ReactComponent as CostHeadingIcon } from "../../assets/Icons/costheading.svg";
// import { ReactComponent as CountryIcon } from "../../assets/Icons/country.svg";
// import { ReactComponent as UserIcon } from "../../assets/Icons/usermanagement.svg";
// import { ReactComponent as VendorIcon } from "../../assets/Icons/vendormanagment.svg";
// import { ReactComponent as BookingIcon } from "../../assets/Icons/bookingmanagement.svg";
// import { ReactComponent as Signout } from "../../assets/Icons/switch.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaUsers } from "react-icons/fa";
import { AiOutlineBell } from "react-icons/ai";
import { BiCalendarEvent } from "react-icons/bi";
import { RiFileHistoryFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useLogoutUser } from "../../hooks/userAuthManagement";
import { useDispatch, useSelector } from "react-redux";
import AllMastersAdminlogo from "../../assets/Images/AllMastersAdminlogo.jpg";
import { MdOutlineSecurity, MdManageAccounts } from "react-icons/md";
// import { useGetAllNotificationData } from "../../hooks/notification";
// import { openNotifyBar } from "../../redux/slices/notificationBarSlice";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
// import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
// import FeedbackIcon from "@mui/icons-material/Feedback";
import { TreeView } from "@mui/x-tree-view/TreeView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import styled from "@emotion/styled";
// import { useGetRoleDataByRoleId } from "../../hooks/role";
import Loader from "../loader";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import InventoryIcon from '@mui/icons-material/Inventory';

const CustomisedTreeView = styled(TreeView)`
  .Mui-selected {
    background: transparent !important;
  }
  & .MuiTreeItem-content:hover {
    background: transparent !important;
  }
  & .MuiBox-root {
    cursor: pointer !important;
  }
  & .MuiTypography-root {
    cursor: pointer !important;
  }
  & .MuiSvgIcon-root {
    cursor: pointer !important;
  }
`;

function Sidebar({ onClick }) {
  const ProfileRole = useSelector((state) => state.profile.role);
  const rolePermission = useSelector((state) => state.profile.permission);
  const ProfileRoleName = useSelector((state) => state.profile.roleName);

  const allMasterId = localStorage.getItem("allMasterId");
  const page = 1;

  const dispatch = useDispatch();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(
    location.pathname.split("/").pop()
  );

  const navigate = useNavigate();

  useEffect(() => {
    setActiveStep(location.pathname.split("/").pop());
  }, [location]);

  const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const {
      bgColor,
      color,
      labelIcon: LabelIcon,
      labelInfo,
      labelText,
      colorForDarkMode,
      bgColorForDarkMode,
      classname,
      location,
      Registration,
      ...other
    } = props;

    return (
      <TreeItem
        className={classname}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              pr: 0,
              pl: 1.5,
              gap: 1,
            }}
            onClick={() => {
              Registration !== "Registration" &&
                navigate(
                  `${
                    ProfileRole === 2 ? "/admin" : `/${ProfileRoleName}`
                  }${location}`
                );
            }}
          >
            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography
              variant="body2"
              className="typography"
              sx={{
                fontWeight: "400",
                color: "#000",
                fontSize: "16px",
                flexGrow: 1,
              }}
            >
              {labelText}
            </Typography>
          </Box>
        }
        {...other}
        ref={ref}
      />
    );
  });

  // if (roleByIdLoading) {
  // 	return <Loader />;
  // }

  return (
    <div className={styles.sidebardiv}>
      <div className={styles.sidebarcontainer}>
        <div className={styles.logodiv}>
          <div className={styles.allmasterlogodiv}>
            <img
              src={AllMastersAdminlogo}
              className={styles.allmasterimg}
              alt=""
            />
            <h1 className={styles.allmastertxt}>AllMasters</h1>
          </div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onClick}
            edge="start"
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className={styles.listdiv}>
          <ul className={styles.slist}>
            <>
              <li
                className={
                  activeStep === "user" ? styles.activesidebarstep : ""
                }
              >
                <Link
                  to={"user"}
                  className={`${styles.listitem} ${
                    activeStep === "user" ? styles.activesidebar : ""
                  }`}
                >
                  <GroupAddIcon
                    className={
                      activeStep === "user"
                        ? styles.activeicon
                        : styles.inActvieIcon
                    }
                  />
                  User
                </Link>
              </li>
              <li
                className={
                  activeStep === "products" ? styles.activesidebarstep : ""
                }
              >
                <Link
                  to={"products"}
                  className={`${styles.listitem} ${
                    activeStep === "products" ? styles.activesidebar : ""
                  }`}
                >
                  <InventoryIcon
                    className={
                      activeStep === "products"
                        ? styles.activeicon
                        : styles.inActvieIcon
                    }
                  />
                  Products
                </Link>
              </li>
            </>
          </ul>
        </div>
        <div
          className={`${styles.listdiv} ${
            ProfileRole !== 2 ? styles.listdived : styles.listdiveds
          }`}
        >
          <ul
            className={`${styles.slist} ${styles.accountdiv} ${styles.accounteddiv}`}
          >
            <li
              className={`${styles.forgot} ${styles.signout}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.clear();
                window.location.replace("/login");
              }}
            >
              <LogoutIcon  className={styles.logouticon} />
              Sign Out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
