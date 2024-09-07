// StationHeader.tsx
import React from 'react';

interface StationHeaderProps {
  stationData: {
    designation: string;
    activites: string;
    identifiantFiscal: string;
    numeroCompte: string;
    commune: string;
    adresseMail: string;
    registreCommerce: string;
    logo: string; // Chemin ou URL du logo
  };
}

const StationHeader: React.FC<StationHeaderProps> = ({ stationData }) => {
  return (
    <div className="station-info-header">
      {stationData.logo && <img src={stationData.logo} alt="Logo Station" className="station-logo" />}
      <h2>{stationData.designation}</h2>
      <p>{stationData.activites}</p>
      <p>Identifiant Fiscal: {stationData.identifiantFiscal}</p>
      <p>Commune: {stationData.commune}</p>
      <p>Email: {stationData.adresseMail}</p>
    </div>
  );
};

export default StationHeader;
