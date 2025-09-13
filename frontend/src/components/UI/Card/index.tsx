import React from 'react';
import styles from './card.module.css';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, className, onClick }) => {
    return (
        <div
            className={`${styles.card} ${className ? className : ''}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
};
