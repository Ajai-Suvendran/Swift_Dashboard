import React from 'react';
import OriginalMessage from './OriginalMessage';
import TranslatedMessage from './TranslatedMessage';
import styles from './MessagePanels.module.css';

interface MessagePanelsProps {
    originalMessage: string;
    translatedMessage: string;
    onBack: () => void;
}

const MessagePanels: React.FC<MessagePanelsProps> = ({ originalMessage, translatedMessage, onBack }) => {
    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={onBack}>Back</button>
            <div className={styles.panels}>
                <div className={styles.panel}>
                    <h2>Original Message</h2>
                    <OriginalMessage message={originalMessage} />
                </div>
                <div className={styles.panel}>
                    <h2>Translated Message</h2>
                    <TranslatedMessage message={translatedMessage} />
                </div>
            </div>
        </div>
    );
};

export default MessagePanels;