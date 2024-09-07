import React from 'react';
import { useTable, Column, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './CuveTable.css';

interface Cuve {
  id: number;
  designation: string;
  nom: string;
  produit_stocke: string;
  capacite_stockage: string;
  prix_achat: string;
}

interface CuveTableProps {
  cuves: Cuve[];
  onEditCuve: (cuve: Cuve) => void;
  onDeleteCuve: (id: number) => void;
  onClose: () => void;
}

const CuveTable: React.FC<CuveTableProps> = ({ cuves, onEditCuve, onDeleteCuve, onClose }) => {
  const columns: Column<Cuve>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Désignation', accessor: 'designation' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Produit stocké', accessor: 'produit_stocke' },
      { Header: 'Capacité', accessor: 'capacite_stockage' },
      { Header: 'Prix d\'achat', accessor: 'prix_achat' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onEditCuve(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeleteCuve(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditCuve, onDeleteCuve]
  );

  const tableInstance = useTable({ columns, data: cuves }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className="cuve-table-container">
      <div className="table-header">
        <h2>Liste des Cuves</h2>
        <div className="table-header-actions">
          <button onClick={() => window.print()} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <table {...getTableProps()} className="cuve-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
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
  );
};

export default CuveTable;
