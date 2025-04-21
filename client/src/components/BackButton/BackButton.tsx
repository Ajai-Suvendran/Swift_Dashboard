import React from 'react';
import styles from './BackButton.module.css';

interface BackButtonProps {
    data: string;
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ( { data, onClick }) => {
    return (
        <button className={styles.backButton} onClick={onClick}>
            {data}
        </button>
    );
};

export default BackButton;