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
  onClose: () => void;
}

const EmployeTable: React.FC<EmployeTableProps> = ({ employees, onEditEmployee, onDeleteEmployee, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Colonnes pour la table, seulement 4 colonnes affichées
  const columns: Column<Employee>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Nom', accessor: 'nom' },
      { Header: 'Prénom', accessor: 'prenom' },
      { Header: 'Date de Naissance', accessor: 'dateNaissance' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button onClick={() => setSelectedEmployee(row.original)} className="action-button">
              Détails
            </button>
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

  const tableInstance = useTable({ columns, data: employees }, useGlobalFilter, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setGlobalFilter(e.target.value);
  };

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

      {/* Affichage des détails */}
      {selectedEmployee && (
        <div className="employee-details-modal">
          <div className="employee-details-content">
            <h2>Détails de l'Employé</h2>
            <p><strong>ID:</strong> {selectedEmployee.id}</p>
            <p><strong>Nom:</strong> {selectedEmployee.nom}</p>
            <p><strong>Prénom:</strong> {selectedEmployee.prenom}</p>
            <p><strong>Date de Naissance:</strong> {selectedEmployee.dateNaissance}</p>
            <p><strong>Âge:</strong> {selectedEmployee.age}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Situation Matrimoniale:</strong> {selectedEmployee.situationMatrimoniale}</p>
            <p><strong>Téléphone:</strong> {selectedEmployee.telephone}</p>
            <p><strong>Numéro de Compte:</strong> {selectedEmployee.numeroCompte}</p>
            <p><strong>Personne à Prévenir:</strong> {selectedEmployee.personneAPrevenir}</p>
            <p><strong>Téléphone Personne à Prévenir:</strong> {selectedEmployee.telephonePersonneAPrevenir}</p>
            <p><strong>Nationalité:</strong> {selectedEmployee.nationalite}</p>
            <p><strong>Numéro Matricule:</strong> {selectedEmployee.numeroMatricule}</p>
            <p><strong>Poste Occupé:</strong> {selectedEmployee.posteOccupe}</p>
            <p><strong>Numéro Carte d'Identité:</strong> {selectedEmployee.numeroCarteIdentite}</p>
            <button onClick={() => setSelectedEmployee(null)} className="close-details-button">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeTable;
