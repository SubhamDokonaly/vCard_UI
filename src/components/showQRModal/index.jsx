import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeQRPopup } from "../../redux/slices/popupSlice";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function ShowQRModal() {
  const popupState = useSelector((state) => state.popup.qrPopup);
  const dispatch = useDispatch();
  const [qrCode, setQrCode] = useState(null);
  const userId = localStorage.getItem("allMasterId");

  function handleClose() {
    dispatch(closeQRPopup());
  }

  useEffect(() => {
    async function GenerateQR() {
      try {
        const qrText = `${window.location.origin}/user/${userId}`;
        const qrCodeImg = await QRCode.toDataURL(qrText);
        setQrCode(qrCodeImg);
      } catch (err) {
        console.error(err);
      }
    }
    GenerateQR();
  }, [userId]);

  return (
    <Dialog open={popupState} onClose={handleClose}>
      <DialogTitle>{"QR Code"}</DialogTitle>
      <DialogContent>
        <img src={qrCode} alt="QR Code" />
      </DialogContent>
    </Dialog>
  );
}
