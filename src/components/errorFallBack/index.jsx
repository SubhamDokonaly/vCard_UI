import styles from './index.module.css';

function ErrorFallback() {
    return (
        <div className={styles["fallback-container"]}>
            <h1 className={styles.oopstxt}>Oops!</h1>
            <h2 className={styles.somethingtxt}>Something went wrong!</h2>
            <p className={styles.errortxt}>Brace yourself till we get the error fixed.<br></br>
                You may also refresh the page or try again later...</p>
        </div>
    )
}

export default ErrorFallback;