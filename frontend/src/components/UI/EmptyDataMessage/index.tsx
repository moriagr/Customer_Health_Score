import React from 'react';
import styles from './emptyDataMessage.module.css';

interface Props {
    message?: string;
}

export const EmptyDataMessage: React.FC<Props> = ({ message }) => {
    return (
        <div className={styles.emptyDataMessage}>
            <p>{message || 'No data available.'}</p>
        </div>
    );
};
