import React from 'react';
import styles from './progressBar.module.css';

interface ProgressBarProps {
    value: number;
    max?: number;
    color?: string;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    color = '#4caf50',
    showLabel = true,
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div
            className={styles.container}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
        >
            <div
                className={styles.filler}
                style={{ width: `${percentage}%`, background: color }}
            />
            {showLabel && (
                <span className={styles.label}>
                    {value}/{max}
                </span>
            )}
        </div>
    );
};
