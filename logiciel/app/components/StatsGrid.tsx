'use client';

import { AlertTriangle, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mer', value: 550 },
  { name: 'Jeu', value: 450 },
  { name: 'Ven', value: 600 },
  { name: 'Sam', value: 700 },
  { name: 'Dim', value: 900 },
];

export default function StatsGrid() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Tableaux de bord</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Section */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
          <AlertItem 
            type="danger" 
            title="Tournée 6 : Arbre sur la voie" 
          />
          <AlertItem 
            type="warning" 
            title="Tournée 3 : Bouchons modérés" 
          />
          <AlertItem 
            type="danger" 
            title="Tournée 8 : Bouchons importants" 
          />
          <AlertItem 
            type="danger" 
            title="Tournée 5 : Accident sur l'A10" 
          />
        </div>

        {/* Chart Section */}
        <div className="bg-slate-50 rounded-xl p-4 h-48 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 w-full h-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ type, title }: { type: 'danger' | 'warning', title: string }) {
  const isDanger = type === 'danger';
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors cursor-default">
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
      }`}>
        <AlertTriangle className="w-5 h-5" />
      </div>
      <span className="text-slate-700 font-medium text-sm">{title}</span>
    </div>
  );
}
