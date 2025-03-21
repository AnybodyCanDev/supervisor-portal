// components/VendorBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";
import { Bill } from "../../types/types";

interface VendorBarChartProps {
  bills: Bill[];
}

export default function VendorBarChart({ bills }: VendorBarChartProps) {
  // Count the number of bills per vendor
  const vendorCounts: Record<string, number> = {};
  bills.forEach((bill) => {
    const vendor = bill.vendor_name || "Unknown";
    vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
  });

  const data = Object.entries(vendorCounts).map(([vendor, count]) => ({
    vendor,
    count,
  }));

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Bills by Vendor</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vendor" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Number of Bills" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
