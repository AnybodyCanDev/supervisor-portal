// components/StatusPieChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";
import { Bill } from "../../types/types";

interface StatusPieChartProps {
  bills: Bill[];
}

export default function StatusPieChart({ bills }: StatusPieChartProps) {
  // Count the number of bills per status
  const statusCounts: Record<string, number> = {};
  bills.forEach((bill) => {
    const status = bill.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#F45C84"];

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Bills by Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
