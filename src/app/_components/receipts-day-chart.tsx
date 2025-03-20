'use client'
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Receipt {
  created_at: string;
}

interface Props {
  receipts: Receipt[];
}

export default function ReceiptsDayChart({ receipts }: Props) {
  // Process data: Group receipts by date and count them
  const data = useMemo(() => {
    const counts: Record<string, number> = {};

    receipts.forEach((receipt) => {
      const date = new Date(receipt.created_at).toISOString().split('T')[0] as string; // Extract YYYY-MM-DD
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [receipts]);

  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Receipts Per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
