import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dummyData } from '../data/dummyData';
import styles from './MessagesPage.module.css';
import Table from './Table/Table';
import Button from './BackButton/BackButton';
import { MessageData } from '../types';

const MessagesPage: React.FC = () => {
    const location = useLocation();
    const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);

    // Check for navigation state on component mount
    useEffect(() => {
        if (location.state && location.state.selectedMessageId && location.state.showDetails) {
            const message = dummyData.find(item => item.id === location.state.selectedMessageId);
            if (message) {
                setSelectedMessage(message);
            }
        }
    }, [location]);

    // This handler will be passed to the Table component
    const handleRowClick = (id: string) => {
        const message = dummyData.find(item => item.id === id);
        if (message) {
            setSelectedMessage(message);
        }
    };
  
    const handleBackClick = () => {
        setSelectedMessage(null);
    };
  
    return (
        <div className={styles.container}>
            <h2>Messages List</h2>
            
            {selectedMessage ? (
                <div className={styles.detailView}>
                    {/* Show just the selected row */}
                    <div className={styles.singleRow}>
                        <Table data={[selectedMessage]} onRowClick={() => {}} />
                    </div>
                    
                    <Button onClick={handleBackClick} data={'Back to All Messages'}></Button>
                    
                    <div className={styles.messagePanels}>
                        <div className={styles.panel}>
                            <h2>Original Message</h2>
                            <div className={styles.messageContent}>
                                {selectedMessage.originalMessage}
                            </div>
                        </div>
                        
                        <div className={styles.panel}>
                            <h2>Translated Message</h2>
                            <div className={styles.messageContent}>
                                {selectedMessage.translatedMessage}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <Table data={dummyData} onRowClick={handleRowClick} />
                </div>
            )}
        </div>
    );
};

export default MessagesPage;