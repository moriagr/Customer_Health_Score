import React from "react";
import styles from "./loading.module.css";

export const Loading: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
        </div>
    );
};
