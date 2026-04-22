"use client";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface AlertData {
  id: string;
  type: "urgent" | "maintenance" | "info";
  title: string;
  description: string;
  time: string;
}

interface AlertsListProps {
  alerts: AlertData[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="w-5 h-5 text-opti-red" />;
      case "maintenance": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "urgent": return <span className="text-[10px] font-bold text-opti-red uppercase tracking-wider">Urgent</span>;
      case "maintenance": return <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Maintenance</span>;
      case "info": return <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Info</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-xl font-bold text-opti-blue mb-4 font-display">Alertes & Notifications</h3>

      <div className="space-y-4 flex-1">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="shrink-0 mt-1.5 flex justify-center w-6">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  {getLabel(alert.type)}
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-medium">{alert.time}</span>
                </div>
                <h4 className="text-sm font-bold text-opti-blue truncate my-0.5">{alert.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{alert.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-gray-400">
            <p>Aucune alerte</p>
          </div>
        )}
      </div>
    </div>
  );
}
