import React, { useState } from 'react';
import { useTable, Column, useSortBy, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faPrint } from '@fortawesome/free-solid-svg-icons';
import './EmployeTable.css';

// Définir l'interface pour Employee
interface Employee {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: number;
  email: string;
  situationMatrimoniale: string;
  numeroCompte: string;
  personneAPrevenir: string;
  telephonePersonneAPrevenir: string;
  telephone: string;
  nationalite: string;
  numeroMatricule: string;
  posteOccupe: string;
  numeroCarteIdentite: string;
}

// Propriétés que le composant va recevoir
interface EmployeTableProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: number) => void;
  onClose: () => void; // Fonction pour fermer la table
}

const EmployeTable: React.FC<EmployeTableProps> = ({ employees, onEditEmployee, onDeleteEmployee, onClose }) => {
  const [searchInput, setSearchInput] = useState('');

  // Colonnes pour la table
  const columns: Column<Employee>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Prénom', accessor: 'prenom' },
      { Header: 'Date de Naissance', accessor: 'dateNaissance' },
      { Header: 'Âge', accessor: 'age' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Situation Matrimoniale', accessor: 'situationMatrimoniale' },
      { Header: 'Téléphone', accessor: 'telephone' },
      { Header: 'Numéro de Compte', accessor: 'numeroCompte' },
      { Header: 'Personne à Prévenir', accessor: 'personneAPrevenir' },
      { Header: 'Téléphone Personne à Prévenir', accessor: 'telephonePersonneAPrevenir' },
      { Header: 'Nationalité', accessor: 'nationalite' },
      { Header: 'Numéro Matricule', accessor: 'numeroMatricule' },
      { Header: 'Poste Occupé', accessor: 'posteOccupe' },
      { Header: 'Numéro de Carte Identité', accessor: 'numeroCarteIdentite' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button onClick={() => onEditEmployee(row.original)} className="action-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDeleteEmployee(row.original.id)} className="action-button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [onEditEmployee, onDeleteEmployee]
  );

  // Instancier la table avec react-table
  const tableInstance = useTable({ columns, data: employees }, useGlobalFilter, useSortBy);

  // Destructurer les méthodes/fonctionnalités de la table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  // Gérer la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setGlobalFilter(e.target.value);
  };

  // Imprimer la table
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="employe-table-container">
      <div className="table-header">
        <h2>Liste des Employés</h2>
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
        <table {...getTableProps()} className="employe-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
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
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render('Cell')}
                    </td>
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

export default EmployeTable;
