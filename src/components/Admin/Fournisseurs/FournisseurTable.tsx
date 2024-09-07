import React from 'react';
import { useTable, Column, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './FournisseurTable.css';

interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  categorie: string;
  livraison: string;
}

interface FournisseurTableProps {
  fournisseurs: Fournisseur[];
  onEditFournisseur: (fournisseur: Fournisseur) => void;
  onDeleteFournisseur: (id: number) => void;
  onClose: () => void;
}

const FournisseurTable: React.FC<FournisseurTableProps> = ({ fournisseurs, onEditFournisseur, onDeleteFournisseur, onClose }) => {
  const columns: Column<Fournisseur>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Adresse', accessor: 'adresse' },
      { Header: 'Téléphone', accessor: 'telephone' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Catégorie', accessor: 'categorie' },
      { Header: 'Livraison', accessor: 'livraison' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onEditFournisseur(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeleteFournisseur(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditFournisseur, onDeleteFournisseur]
  );

  const tableInstance = useTable({ columns, data: fournisseurs }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fournisseur-table-container">
      <div className="table-header">
        <h2>Liste des Fournisseurs</h2>
        <div className="table-header-actions">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <table {...getTableProps()} className="fournisseur-table">
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
  );
};

export default FournisseurTable;
