import React from 'react';

export const Loading: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div style={{
                width: 50,
                height: 50,
                border: '5px solid #ccc',
                borderTop: '5px solid #4CAF50',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>
                {`@keyframes spin { 
              0% { transform: rotate(0deg); } 
              100% { transform: rotate(360deg); } 
          }`}
            </style>
        </div>
    );
};