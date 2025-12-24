import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CostBreakdown } from '../types';

interface BudgetChartsProps {
  costs: CostBreakdown;
  currency?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ costs, currency = "$" }) => {
  const pieData = [
    { name: 'Transport', value: costs.transport },
    { name: 'Stay', value: costs.accommodation },
    { name: 'Food', value: costs.food },
    { name: 'Activities', value: costs.activities },
    { name: 'Hidden/Misc', value: costs.hiddenCosts },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Allocated', amount: costs.total }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cost Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${currency}${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Total Estimate</h3>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
           <div className="text-center">
             <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Estimated Cost</span>
             <p className="text-4xl font-bold text-indigo-600 mt-2">{currency}{costs.total.toLocaleString()}</p>
           </div>
           
           <div className="w-full px-4">
             <div className="flex justify-between text-sm text-slate-600 mb-1">
               <span>Efficiency Score</span>
               <span className="font-semibold text-emerald-600">High</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5">
               <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
