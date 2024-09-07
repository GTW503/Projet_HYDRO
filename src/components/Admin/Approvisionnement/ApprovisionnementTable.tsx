import React from 'react';
import { useTable, Column, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './ApprovisionnementTable.css';

interface Approvisionnement {
  id: number;
  date: string;
  fournisseur: string;
  categorie: string;
  produit: string;
  stockFinal: number;
  stockArrive: number;
  melange: number;
  stockTotal: number;
  emplacement: string;
  montantPayer: number;
}

interface ApprovisionnementTableProps {
  approvisionnements: Approvisionnement[];
  onEditApprovisionnement: (approvisionnement: Approvisionnement) => void;
  onDeleteApprovisionnement: (id: number) => void;
  onClose: () => void;
}

const ApprovisionnementTable: React.FC<ApprovisionnementTableProps> = ({ approvisionnements, onEditApprovisionnement, onDeleteApprovisionnement, onClose }) => {
  const columns: Column<Approvisionnement>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Fournisseur', accessor: 'fournisseur' },
      { Header: 'Catégorie', accessor: 'categorie' },
      { Header: 'Produit', accessor: 'produit' },
      { Header: 'Stock Final', accessor: 'stockFinal' },
      { Header: 'Stock Arrivé', accessor: 'stockArrive' },
      { Header: 'Mélange', accessor: 'melange' },
      { Header: 'Stock Total', accessor: 'stockTotal' },
      { Header: 'Emplacement', accessor: 'emplacement' },
      { Header: 'Montant Payé', accessor: 'montantPayer' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onEditApprovisionnement(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeleteApprovisionnement(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditApprovisionnement, onDeleteApprovisionnement]
  );

  const tableInstance = useTable({ columns, data: approvisionnements }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="approvisionnement-table-container">
      <div className="table-header">
        <h2>Liste des Approvisionnements</h2>
        <div className="table-header-actions">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <table {...getTableProps()} className="approvisionnement-table">
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

export default ApprovisionnementTable;
