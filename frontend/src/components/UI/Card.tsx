import React from 'react';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, className, onClick }) => {
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: 16,
                minWidth: 200,
                ...style,
            }}
        >
            {children}
        </div>
    );
};
