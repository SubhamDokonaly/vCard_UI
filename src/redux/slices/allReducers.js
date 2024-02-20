import { combineReducers } from "@reduxjs/toolkit";
import profileSlice from "./profileSlice";
import popupSlice from "./popupSlice";
import sidebarSlice from "./sidebarSlice";

export const rootReducer = combineReducers({
  profile: profileSlice,
  popup: popupSlice,
  sidebar: sidebarSlice,
});
