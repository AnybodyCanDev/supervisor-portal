'use client';

import { useState, useEffect } from 'react';
import { RaiseFlag } from '../../types/types';
import { getFlags } from '~/server/queries';
import Icon from '../_components/icon-wrapper';
import Loader from '../_components/loader';

const flagColors: Record<string, string> = {
  'PO_FETCH_ERROR': 'bg-red-500',
  'PO_NOT_FOUND': 'bg-yellow-500',
  'RECEIPT_FOR_APPROVED_PO': 'bg-blue-500',
};

export default function Flags() {
  const [flags, setFlags] = useState<RaiseFlag[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFlags = async () => {
    const data = await getFlags();
    setFlags(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const filteredFlags = flags.filter(
    (flag) => filter === 'all' || flag.flag_type === filter
  );

  return (
    <div className="w-full">
    <div className='p-4 bg-white shadow-md rounded-xl'>
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 flex">
            <Icon icon="flag" className="mr-2" /> Flags
        </h1>
        <div className="flex gap-4">
            <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered bg-blue-50 rounded-lg w-32 shadow-sm"
            >
            <option value="all">All</option>
            <option value="PO_FETCH_ERROR">PO Fetch Error</option>
            <option value="PO_NOT_FOUND">PO Not Found</option>
            <option value="RECEIPT_FOR_APPROVED_PO">Receipt for Approved PO</option>
            </select>
        </div>
    </div>
      {!loading ? (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {filteredFlags.map((flag) => (
            <div key={flag.flag_id} className="p-4 bg-gray-50 shadow-lg rounded-lg">
              <p className={`px-2 py-1 text-white rounded-md ${flagColors[flag.flag_type] || 'bg-gray-500'}`}>
                {flag.flag_type.replace(/_/g, ' ')}
              </p>
              <p className="mt-2 text-sm font-mono break-all">{flag.flag_description}</p>
              <p className="text-gray-500 text-xs mt-2">{new Date(flag.created_at).toLocaleString()}</p>
              <button className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-md shadow">Action</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      )}
    </div>
  );
}
