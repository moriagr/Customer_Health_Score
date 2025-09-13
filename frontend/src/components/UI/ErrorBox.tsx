import React from 'react';

interface ErrorBoxProps {
    error: string;
    goBack?: () => void;
    tryAgain?: () => void;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ error, goBack, tryAgain }) => {
    return (
        <div style={{
            background: '#ffe5e5',
            border: '1px solid #ff4d4d',
            color: '#a60000',
            padding: '20px',
            margin: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
        }}>
            {error}
            <br />
            {tryAgain || goBack ?
                <div>

                    {tryAgain ?
                        <button
                            onClick={() => tryAgain()}
                            style={{
                                marginTop: '10px',
                                background: '#ff4d4d',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginRight: goBack ? '30px' : '0px'
                            }}
                        >
                            Try Again
                        </button> : <></>}
                    {goBack ?
                        <button
                            onClick={() => goBack()}
                            style={{
                                marginTop: '10px',
                                background: '#594dffff',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            Go Back
                        </button> : <></>}
                </div>
                : <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '10px',
                        background: '#ff4d4d',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    🔄 Retry
                </button>}
        </div>
    );

};