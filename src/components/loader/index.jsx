import logo from "/loader.gif";
import styles from "./index.module.css";

export default function Loader() {
  return (
    <div
      className={styles.loaderContainer}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <img
        decoding="async"
        alt="Animated"
        src={logo}
        width="200"
        height="200"
        className="attachment-large size-large wp-image-2708"
      />
    </div>
  );
}
