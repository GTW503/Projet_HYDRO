import React, { useState } from 'react';
import { useTable, Column, useSortBy, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './PompeTable.css';

interface Pompe {
  id: number;
  nom: string;
  contenu: string;
  capacite: number;
  type: string;
  station: string;
}

interface PompeTableProps {
  pompes: Pompe[];
  onEditPompe: (pompe: Pompe) => void;
  onDeletePompe: (id: number) => void;
  onClose: () => void; // Function to handle closing the table
}

const PompeTable: React.FC<PompeTableProps> = ({ pompes, onEditPompe, onDeletePompe, onClose }) => {
  const [searchInput, setSearchInput] = useState('');

  const columns: Column<Pompe>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Contenu', accessor: 'contenu' },
      { Header: 'Capacité', accessor: 'capacite' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Station', accessor: 'station' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onEditPompe(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeletePompe(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditPompe, onDeletePompe]
  );

  const tableInstance = useTable({ columns, data: pompes }, useGlobalFilter, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setGlobalFilter(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pompe-table-container">
      <div className="table-header">
        <h2>Liste des Pompes</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Rechercher par nom, ID, etc."
          className="search-input"
        />
        <div className="table-header-actions">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <div className="table-scroll">
        <table {...getTableProps()} className="pompe-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PompeTable;
