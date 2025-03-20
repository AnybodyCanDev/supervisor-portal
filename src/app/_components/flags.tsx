// pages/admin/flags.tsx
import { useState, useEffect } from 'react';
import { RaiseFlag } from '../../types/types';

export default function Flags() {
  const [flags, setFlags] = useState<RaiseFlag[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/flags') // Replace with your API endpoint
      .then((res) => res.json())
      .then((data: RaiseFlag[]) => setFlags(data));
  }, []);

  const filteredFlags = flags
    .filter((flag) => flag.zoho_po_number?.includes(search) || !search)
    .filter((flag) => filter === 'all' || flag.flag_type === filter);

  const handleAction = (flagId: number, action: string) => {
    console.log(`Action: ${action} on flag ${flagId}`);
    // Add API call here to resolve/escalate flag
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Raised Flags</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by PO Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="all">All</option>
          <option value="type1">Type 1</option> {/* Replace with actual types */}
          <option value="type2">Type 2</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>PO Number</th>
              <th>Type</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlags.map((flag) => (
              <tr key={flag.flag_id}>
                <td>{flag.flag_id}</td>
                <td>{flag.zoho_po_number || 'N/A'}</td>
                <td>{flag.flag_type}</td>
                <td>{flag.flag_description}</td>
                <td>{new Date(flag.created_at).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleAction(flag.flag_id, 'resolve')}
                    className="btn btn-sm btn-primary mr-2"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleAction(flag.flag_id, 'escalate')}
                    className="btn btn-sm btn-secondary"
                  >
                    Escalate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}