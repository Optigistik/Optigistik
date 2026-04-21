"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import {
  getIncidents,
  getStats,
  Incident,
  ChartData,
} from "@/services/dashboard";
import DashboardCard from "./DashboardCard";

export default function StatsGrid() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsData, statsData] = await Promise.all([
          getIncidents(),
          getStats(),
        ]);
        setIncidents(incidentsData);
        setChartData(statsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Incidents Card */}
      <DashboardCard title="Tableaux de bord – Incident récents">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[100px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opti-red"></div>
          </div>
        ) : incidents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((incident) => (
              <AlertItem
                key={incident.id}
                type={incident.type}
                title={incident.title}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-gray-400">
            <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
            <p>Aucun incident à signaler</p>
          </div>
        )}
      </DashboardCard>

      {/* Activity Card */}
      <DashboardCard title="Activité hebdomadaire">
        <div className="h-48 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-opti-red"></div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}

function AlertItem({
  type,
  title,
}: {
  type: "danger" | "warning";
  title: string;
}) {
  const isDanger = type === "danger";
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-default hover:bg-gray-100 transition-colors">
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
          isDanger
            ? "border-red-200 text-opti-red"
            : "border-amber-200 text-amber-500"
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
      </div>
      <span className="text-opti-blue font-bold text-sm truncate">{title}</span>
    </div>
  );
}
