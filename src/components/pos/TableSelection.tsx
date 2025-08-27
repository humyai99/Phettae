import React from 'react';
import { Table } from '../../models';
import './TableSelection.css';

interface TableSelectionProps {
  tables: Table[];
  onSelectTable: (tableId: number) => void;
  onBack: () => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ tables, onSelectTable, onBack }) => {
  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      onSelectTable(table.id);
    }
    // Clicks on occupied/dirty tables do nothing
  };

  return (
    <div className="selection-overlay">
      <div className="selection-container">
        <div className="selection-header">
          <button onClick={onBack} className="back-button">←</button>
          <h2>Select a Table</h2>
        </div>
        <div className="table-grid">
          {tables.map(table => (
            <div
              key={table.id}
              className={`table-card ${table.status}`}
              onClick={() => handleTableClick(table)}
            >
              <span className="table-number">{table.id}</span>
              <span className="table-status">{table.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSelection;
