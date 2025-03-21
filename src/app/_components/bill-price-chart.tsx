// components/PriceTierChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";
import { Bill } from "../../types/types";

interface PriceTierChartProps {
  bills: Bill[];
}

export default function PriceTierChart({ bills }: PriceTierChartProps) {
  // Define the price tiers
  const tiers = [
    { label: "0-10k", min: 0, max: 10000 },
    { label: "10k-50k", min: 10000, max: 50000 },
    { label: "50k-250k", min: 50000, max: 250000 },
    { label: "250k-1M", min: 250000, max: 1000000 },
    { label: "1M-5M", min: 1000000, max: 5000000 },
    { label: "5M-10M", min: 5000000, max: 10000000 },
    { label: "10M+", min: 10000000, max: Infinity },
  ];

  // Initialize counts per tier
  const tierCounts = tiers.map((tier) => ({
    label: tier.label,
    count: 0,
  }));

  bills.forEach((bill) => {
    const total = bill.total;
    const tier = tiers.find((t) => total >= t.min && total < t.max);
    if (tier) {
      const index = tiers.indexOf(tier);
      if (index !== -1) {
        if (tierCounts[index]) {
          tierCounts[index].count++;
        }
      }
    }
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Bills by Price Tier</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tierCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" name="Number of Bills" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
