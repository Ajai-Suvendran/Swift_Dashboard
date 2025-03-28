import React, { useState } from 'react';
import TableRow from './TableRow';
import styles from './Table.module.css';

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
}

const Table: React.FC<TableProps> = ({ data, onRowClick }) => {
    const [filters, setFilters] = useState({
        id: '',
        mtMessageType: '',
        mxMessageType: '',
        direction: '',
        amountMin: '',
        amountMax: '',
        currency: '',
        date: '',
        status: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const filteredData = data.filter(item => {
        return (
            (!filters.id || item.id.includes(filters.id)) &&
            (!filters.mtMessageType || item.mtMessageType.includes(filters.mtMessageType)) &&
            (!filters.mxMessageType || item.mxMessageType.includes(filters.mxMessageType)) &&
            (!filters.direction || item.direction === filters.direction) &&
            (!filters.amountMin || parseFloat(item.amount) >= parseFloat(filters.amountMin)) &&
            (!filters.amountMax || parseFloat(item.amount) <= parseFloat(filters.amountMax)) &&
            (!filters.currency || item.currency.includes(filters.currency)) &&
            (!filters.date || item.date.includes(filters.date)) &&
            (!filters.status || item.status === filters.status)
        );
    });

    const handleRowClick = (id: string) => {
        onRowClick(id);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <div>ID</div>
                            <input type="text" name="id" value={filters.id} onChange={handleFilterChange} placeholder="Search ID" />
                        </th>
                        <th>
                            <div className={styles.msgType}>Mt Message Type</div>
                            <input type="text" name="mtMessageType" value={filters.mtMessageType} onChange={handleFilterChange} placeholder="Search Mt Type" />
                        </th>
                        <th>
                            <div className={styles.msgType}>Mx Message Type</div>
                            <input type="text" name="mxMessageType" value={filters.mxMessageType} onChange={handleFilterChange} placeholder="Search Mx Type" />
                        </th>
                        <th>
                            <div>Direction</div>
                            <select name="direction" value={filters.direction} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="Inward">Inward</option>
                                <option value="Outward">Outward</option>
                            </select>
                        </th>
                        <th>
                            <div>Amount</div>
                            <div className={styles.amountFilter}>
                                <input type="number" name="amountMin" value={filters.amountMin} onChange={handleFilterChange} placeholder="Min" />
                                <input type="number" name="amountMax" value={filters.amountMax} onChange={handleFilterChange} placeholder="Max" />
                            </div>
                        </th>
                        <th>
                            <div>Currency</div>
                            <input type="text" name="currency" value={filters.currency} onChange={handleFilterChange} placeholder="Search Currency" />
                        </th>
                        <th>
                            <div>DateTime</div>
                            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
                        </th>
                        <th>
                            <div>Status</div>
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="Successful">Successful</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <TableRow
                            key={item.id}
                            data={item}
                            onClick={() => handleRowClick(item.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;