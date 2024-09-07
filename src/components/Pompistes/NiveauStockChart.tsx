import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// Exemple de données pour le diagramme circulaire
const data = [
  { name: 'Produit A', value: 400 },
  { name: 'Produit B', value: 300 },
  { name: 'Produit C', value: 300 },
  { name: 'Produit D', value: 200 },
];

// Couleurs pour les différentes sections du diagramme circulaire
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const NiveauStockChart: React.FC = () => {
  return (
    <div className="chart-container">
      <h3>Niveau de Stock</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" iconType="circle" /> {/* Légende sous le diagramme */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NiveauStockChart;
