'use client'
export default function Analytics() {
    return (
      <div className="p-4">
        <h1 className="text-2xl mb-4">Analytics</h1>
        <p>Placeholder for analytics dashboard. Suggested features:</p>
        <ul className="list-disc ml-6">
          <li>Chart of logs over time (e.g., info, warning, error counts).</li>
          <li>Number of raised flags by type.</li>
          <li>Receipt status breakdown (e.g., pie chart).</li>
        </ul>
      </div>
    );
  }