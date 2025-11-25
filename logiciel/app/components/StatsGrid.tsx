"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  getIncidents,
  getStats,
  Incident,
  ChartData,
} from "@/services/dashboard";

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-2xl font-bold text-opti-red mb-6 font-display">
        Tableaux de bord
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Section */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Incidents Récents
          </h3>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
            </div>
          ) : incidents.length > 0 ? (
            incidents.map((incident) => (
              <AlertItem
                key={incident.id}
                type={incident.type}
                title={incident.title}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              Aucun incident signalé.
            </div>
          )}
        </div>

        {/* Chart Section */}
        <div className="bg-gray-50 rounded-xl p-4 h-64 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Activité Hebdomadaire
          </h3>
          <div className="flex-1 w-full min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF3131" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF3131" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
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
                    stroke="#FF3131"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
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
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDanger ? "bg-red-100 text-opti-red" : "bg-amber-100 text-amber-600"
        }`}
      >
        <AlertTriangle className="w-5 h-5" />
      </div>
      <span className="text-gray-700 font-medium text-sm">{title}</span>
    </div>
  );
}
