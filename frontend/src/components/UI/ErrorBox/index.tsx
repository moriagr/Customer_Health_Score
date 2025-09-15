import React from "react";
import styles from "./errorBox.module.css";

interface ErrorBoxProps {
    error: string;
    goBack?: () => void;
    tryAgain?: () => void;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ error, goBack, tryAgain }) => {
    return (
        <div className={styles.errorBox}>
            {error}
            <br />
            {tryAgain || goBack ? (
                <div>
                    {tryAgain && (
                        <button onClick={tryAgain} className={`${styles.button} ${styles.tryAgain}`} style={!goBack ? { marginRight: 0 } : {}}>
                            Try Again
                        </button>
                    )}
                    {goBack && (
                        <button onClick={goBack} className={`${styles.button} ${styles.goBack}`}>
                            Go Back
                        </button>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => window.location.reload()}
                    className={`${styles.button} ${styles.retry}`}
                >
                    🔄 Retry
                </button>
            )}
        </div>
    );
};
