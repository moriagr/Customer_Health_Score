import React from 'react';

interface Props {
    message?: string;
}

export const EmptyDataMessage: React.FC<Props> = ({ message }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            border: '2px dashed #ccc',
            borderRadius: 12,
            backgroundColor: '#f9f9f9',
            color: '#555',
            fontSize: 16,
            margin: 20
        }}>
            <span style={{ fontSize: 40, marginBottom: 10 }}>📭</span>
            <p>{message || 'No data available.'}</p>
        </div>
    );
};
