import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    qrPopup: false,
    linkPopup: false,
  },
  reducers: {
    openQRPopup: (state) => {
      state.qrPopup = true;
    },
    closeQRPopup: (state) => {
      state.qrPopup = false;
    },
    openLinkPopup: (state) => {
      state.linkPopup = true;
    },
    closeLinkPopup: (state) => {
      state.linkPopup = false;
    },
  },
});

export const { openLinkPopup, openQRPopup, closeLinkPopup, closeQRPopup } =
  popupSlice.actions;
export default popupSlice.reducer;
