import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Receipt {
  status: string;
}

interface Props {
  receipts: Receipt[];
}

export default function ReceiptsPieChart({ receipts }: Props) {
  // Count "excess" and "cleared" receipts
  const counts = receipts.reduce(
    (acc, receipt) => {
      if (receipt.status === 'cleared') acc.cleared += 1;
      else acc.excess += 1;
      return acc;
    },
    { cleared: 0, excess: 0 }
  );

  // Data for the pie chart
  const data = [
    { name: 'Cleared', value: counts.cleared },
    { name: 'Excess', value: counts.excess },
  ];

  const COLORS = ['#10B981', '#EF4444']; // Green for cleared, Red for excess

  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Excess vs Cleared</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
