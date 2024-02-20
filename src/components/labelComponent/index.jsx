import { MdDeleteForever } from "react-icons/md";
import { MdUploadFile } from "react-icons/md";
import { openFileNewWindow } from "../../helper";
import styles from "./index.module.css";

function LabelComponent({ fileName, fileData, type, removeFile }) {
  if (fileData != null) {
    return (
      <div className={styles.uploadlabel}>
        <span
          title={fileName}
          className={styles.uploadfile}
          onClick={() => openFileNewWindow(fileData)}
        >
          {fileName}
        </span>
        <MdDeleteForever
          className={styles.deleteicons}
          onClick={() => {
            removeFile(type);
          }}
        />
      </div>
    );
  } else {
    return (
      <label htmlFor={type}>
        <div className={styles.uploadlabel}>
          <MdUploadFile />
          <span>Upload</span>
        </div>
      </label>
    );
  }
}

export default LabelComponent;
