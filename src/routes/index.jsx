import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { removeProfileData } from "../redux/slices/profileSlice";
import Public from "./public";
import { UserApp, AdminApp } from "./private";

function RouteChecker() {
  const profileData = useSelector((state) => state.profile);
  const token = localStorage.getItem("allMasterToken");
  const decodedData = token != null ? jwtDecode(token) : null;

  const dispatch = useDispatch();

  const onIdle = async () => {
    if (profileData.signedIn === true) {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  useIdleTimer({
    onIdle,
    crossTab: true, // sync the time between tabs
    syncTimers: 200, // sync the time between tabs in 0.2 sec
    timeout: 1500000, // it is in ms and idleTime is set for 25 minutes
  });

  useEffect(() => {
    if (profileData.signedIn === true) {
      if (token === null) {
        dispatch(removeProfileData());
      } else {
        if (decodedData.exp * 1000 < new Date().getTime()) {
          localStorage.clear();
          window.location.replace("/login");
        }
      }
    }
  }, [token, decodedData, profileData.signedIn, dispatch]);

  if (profileData.signedIn === false) {
    return <Public />;
  } else {
    switch (profileData.role) {
      case 1:
        return <UserApp />;
      case 2:
        return <AdminApp />;
      default:
        return null;
    }
  }
}

export default function RouterRender() {
  return (
    <BrowserRouter>
      <RouteChecker />
    </BrowserRouter>
  );
}
