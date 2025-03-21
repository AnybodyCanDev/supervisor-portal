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
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [poFilter, setPoFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFlags = async () => {
    const data = await getFlags();
    setFlags(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const filteredFlags = flags.filter((flag) => {
    const matchesType = typeFilter === 'all' || flag.flag_type === typeFilter;
    const matchesPO =
      !poFilter ||
      (flag.zoho_po_number &&
        flag.zoho_po_number.toLowerCase().includes(poFilter.toLowerCase()));
    return matchesType && matchesPO;
  });

  return (
    <div className="w-full">
      <div className="p-4 bg-white shadow-md rounded-xl mb-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <Icon icon="flag" className="mr-2" /> Flags
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by PO Number:
            </label>
            <input
              type="text"
              value={poFilter}
              onChange={(e) => setPoFilter(e.target.value)}
              placeholder="Enter PO number"
              className="input input-bordered bg-blue-50 rounded-lg w-full sm:w-64 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Type:
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 block w-full sm:w-64 select select-bordered bg-blue-50 rounded-lg shadow-sm"
            >
              <option value="all">All</option>
              <option value="PO_FETCH_ERROR">PO Fetch Error</option>
              <option value="PO_NOT_FOUND">PO Not Found</option>
              <option value="EXCESS_ITEMS_RECEIVED">Excess Items Recieved</option>
              <option value="RECEIPT_FOR_APPROVED_PO">Receipt for Approved PO</option>
            </select>
          </div>
        </div>
      </div>

      {!loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFlags.map((flag) => (
                <tr key={flag.flag_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {flag.zoho_po_number || 'N/A'}
                  </td>
                  <td>
                    <div
                        className={`px-6 h-8 flex items-center justify-center whitespace-nowrap text-sm font-bold text-white rounded-md ${
                        flagColors[flag.flag_type] || 'bg-gray-500'
                        }`}
                    >
                    {flag.flag_type.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {flag.flag_description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(flag.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md shadow">
                      Action
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFlags.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    No flags found.
                  </td> 
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      )}
    </div>
  );
}
