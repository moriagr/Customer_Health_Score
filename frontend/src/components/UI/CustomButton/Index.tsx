import React from "react";
import styles from "./customButton.module.css";

interface Props {
    onClickFunc: () => void;
    text: string;
}

export const CustomButton: React.FC<Props> = ({ onClickFunc, text }) => {
    return (
        <button onClick={onClickFunc} className={styles.button}>
            {text}
        </button>
    );
};
