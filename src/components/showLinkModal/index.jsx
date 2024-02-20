import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeLinkPopup } from "../../redux/slices/popupSlice";
import { enqueueSnackbar } from "notistack";
import { MdContentCopy } from "react-icons/md";

export default function ShowLinkModal() {
  const popupState = useSelector((state) => state.popup.linkPopup);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("allMasterId");
  const userURL = `${window.location.origin}/user/${userId}`;

  function handleClose() {
    dispatch(closeLinkPopup());
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(userURL);
      enqueueSnackbar("Copied to Clipboard successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Copy Failed, Please try again", {
        variant: "success",
      });
    }
  }

  return (
    <Dialog open={popupState} onClose={handleClose}>
      <DialogTitle>{"Link"}</DialogTitle>
      <DialogContent>
        <div className="d-flex align-items-center">
          <div className="d-flex gap-2">
            <span className="fw-bold">URL :</span>
            <a href={userURL} target="_blank" rel="noreferrer">
              {userURL}
            </a>
          </div>
          <IconButton onClick={() => copyToClipboard()}>
            <MdContentCopy />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
