import React from 'react';

interface ProgressBarProps {
    value: number;
    max?: number;
    color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = '#4caf50' }) => {
    const percentage = (value / max) * 100;
    return (
        <div style={{ background: '#ddd', borderRadius: 5, width: '100%', height: 20 }}>
            <div
                style={{
                    width: `${percentage}%`,
                    background: color,
                    height: '100%',
                    borderRadius: 5,
                    textAlign: 'right',
                    paddingRight: 5,
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                {value}
            </div>
        </div>
    );
};
