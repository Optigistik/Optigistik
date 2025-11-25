'use client';

export default function MapSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 h-[600px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 font-medium text-lg">Carte Interactive</p>
          <p className="text-slate-400 text-sm">Chargement des données géographiques...</p>
        </div>
      </div>
      {/* Placeholder for map overlay or controls */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded shadow-sm">
        <div className="text-xs font-mono text-slate-500">France View</div>
      </div>
    </div>
  );
}
