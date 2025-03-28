import React from 'react';

const OriginalMessage: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div>
            <h2>Original Message</h2>
            <p>{message}</p>
        </div>
    );
};

export default OriginalMessage;