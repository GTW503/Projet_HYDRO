import React, { useState } from 'react';
import { useTable, Column, useSortBy, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './ProductTable.css';

interface Product {
  id: number;
  designation: string;
  prix_pompe: number;
  categorie_id: string;
  unite_gros: string;
  unite_detail: string;
  capacite: number;
}

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onClose: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEditProduct, onDeleteProduct, onClose }) => {
  const [searchInput, setSearchInput] = useState('');

  const columns: Column<Product>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Désignation', accessor: 'designation' },
      { Header: 'Prix Pompe', accessor: 'prix_pompe' },
      { Header: 'Catégorie', accessor: 'categorie_id' },
      { Header: 'Unité Gros', accessor: 'unite_gros' },
      { Header: 'Unité Détail', accessor: 'unite_detail' },
      { Header: 'Capacité', accessor: 'capacite' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => onEditProduct(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeleteProduct(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditProduct, onDeleteProduct]
  );

  const tableInstance = useTable({ columns, data: products }, useGlobalFilter, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setGlobalFilter(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h2>Liste des Produits</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Rechercher..."
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
      <table {...getTableProps()} className="product-table">
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

export default ProductTable;
