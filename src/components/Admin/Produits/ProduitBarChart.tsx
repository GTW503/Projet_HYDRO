import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProduitBarChartProps {
  data: { name: string; produits: number }[];
}

const ProduitBarChart: React.FC<ProduitBarChartProps> = ({ data }) => {
  return (
    <div className="chart">
      <h3>Produits Enregistrés</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="produits" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProduitBarChart;
