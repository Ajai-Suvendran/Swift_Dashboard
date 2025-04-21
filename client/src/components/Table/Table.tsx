import React from 'react';
import TableRow from './TableRow';
import styles from './Table.module.css';
import { TableFilters } from '../MessagesPage'; // Make sure this path is correct

interface TableProps {
    data: {
        id: string;
        mtMessageType: string;
        mxMessageType: string;
        currency: string;
        date: string;
        direction: string;
        amount: string;
        status: string;
        originalMessage: string;
        translatedMessage: string;
    }[];
    onRowClick: (id: string) => void;
    filters?: TableFilters;
    onFilterChange?: (filters: TableFilters) => void;
    disableFilters?: boolean;
    forceRender?: number; // Add this prop to force re-renders
}

const Table: React.FC<TableProps> = ({ 
    data, 
    onRowClick, 
    filters = {
        id: '',
        mtMessageType: '',
        mxMessageType: '',
        direction: '',
        amountMin: '',
        amountMax: '',
        currency: '',
        dateFrom: '',
        dateTo: '',
        status: ''
    }, 
    onFilterChange = () => {},
    disableFilters = false,
    forceRender 
}) => {
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Update filters through the callback
        onFilterChange({
            ...filters,
            [name]: value
        });
    };

    const filteredData = data;

    const handleRowClick = (id: string) => {
        // Ensure the ID exists in the filtered data before triggering the click
        const itemExists = filteredData.some(item => item.id === id);
        if (itemExists) {
            onRowClick(id);
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <div className={styles.msgType}>Message ID</div>
                            {!disableFilters && (
                                <input 
                                    type="text" 
                                    name="id" 
                                    value={filters.id} 
                                    onChange={handleFilterChange} 
                                    placeholder="Search ID" 
                                    className={filters.id ? styles.activeFilter : ''}
                                />
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Mt Message Type</div>
                            {!disableFilters && (
                                <input 
                                    type="text" 
                                    name="mtMessageType" 
                                    value={filters.mtMessageType} 
                                    onChange={handleFilterChange} 
                                    placeholder="Search Mt Type" 
                                    className={filters.mtMessageType ? styles.activeFilter : ''}
                                />
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Mx Message Type</div>
                            {!disableFilters && (
                                <input 
                                    type="text" 
                                    name="mxMessageType" 
                                    value={filters.mxMessageType} 
                                    onChange={handleFilterChange} 
                                    placeholder="Search Mx Type" 
                                    className={filters.mxMessageType ? styles.activeFilter : ''}
                                />
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Direction</div>
                            {!disableFilters && (
                                <select 
                                    name="direction" 
                                    value={filters.direction} 
                                    onChange={handleFilterChange}
                                    className={filters.direction ? styles.activeFilter : ''}
                                >
                                    <option value="">All</option>
                                    <option value="Inward">Inward</option>
                                    <option value="Outward">Outward</option>
                                </select>
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Amount</div>
                            {!disableFilters && (
                                <div className={styles.amountFilter}>
                                    <input 
                                        type="number" 
                                        name="amountMin" 
                                        value={filters.amountMin} 
                                        onChange={handleFilterChange} 
                                        placeholder="Min" 
                                        className={filters.amountMin ? styles.activeFilter : ''}
                                    />
                                    <input 
                                        type="number" 
                                        name="amountMax" 
                                        value={filters.amountMax} 
                                        onChange={handleFilterChange} 
                                        placeholder="Max" 
                                        className={filters.amountMax ? styles.activeFilter : ''}
                                    />
                                </div>
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Currency</div>
                            {!disableFilters && (
                                <input 
                                    type="text" 
                                    name="currency" 
                                    value={filters.currency} 
                                    onChange={handleFilterChange} 
                                    placeholder="Search Currency" 
                                    className={filters.currency ? styles.activeFilter : ''}
                                />
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>DateTime</div>
                            {!disableFilters && (
                                <div className={styles.dateRangeFilter}>
                                    <input 
                                        type="date" 
                                        name="dateFrom" 
                                        value={filters.dateFrom} 
                                        onChange={handleFilterChange}
                                        className={filters.dateFrom ? styles.activeFilter : ''}
                                        placeholder="From"
                                        title="From date"
                                    />
                                    <input 
                                        type="date" 
                                        name="dateTo" 
                                        value={filters.dateTo} 
                                        onChange={handleFilterChange}
                                        className={filters.dateTo ? styles.activeFilter : ''}
                                        placeholder="To"
                                        title="To date"
                                    />
                                </div>
                            )}
                        </th>
                        <th>
                            <div className={styles.msgType}>Status</div>
                            {!disableFilters && (
                                <select 
                                    name="status" 
                                    value={filters.status} 
                                    onChange={handleFilterChange}
                                    className={filters.status ? styles.activeFilter : ''}
                                >
                                    <option value="">All</option>
                                    <option value="Successful">Successful</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <TableRow
                                key={item.id}
                                data={item}
                                onClick={() => handleRowClick(item.id)}
                            />
                        ))
                    ) : (
                        <tr className={styles.noResults}>
                            <td colSpan={8}>No matching messages found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Export as a memoized component to prevent unnecessary re-renders
export default React.memo(Table);