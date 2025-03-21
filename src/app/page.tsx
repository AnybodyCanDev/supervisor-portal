'use client';

import { useState, useEffect } from 'react';
import { SystemLog } from '../types/types';
import { getLogs } from '~/server/queries';
import Icon from './_components/icon-wrapper';

export default function Logs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [lastRefreshed, setLastRefreshed] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

  const fetchLogs = async () => {
      const data = await getLogs();
      setLogs(data);
      setLoading(false);
      setLastRefreshed(0);
    };
  
    useEffect(() => {
        fetchLogs();
    }, []);



  useEffect(() => {
    const interval = setInterval(() => setLastRefreshed((prev) => prev+1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-600';
    }
  };

  const filteredLogs = logs
    .filter((log) => String(log.zoho_po_number).includes(search))
    .filter((log) => filter === 'all' || log.log_type === filter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl flex font-semibold mb-4 text-gray-700">
            <Icon icon="description" className="mr-2" />
            System Logs
        </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by PO Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-64 bg-blue-50 rounded-lg"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-full max-w-xs bg-blue-50 rounded-lg"
          >
            <option value="all">All</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button onClick={fetchLogs} className="p-2">
            <Icon icon='refresh' size='18px'/>
          </button>
        </div>
        <span className="text-sm text-gray-500">Last refreshed {lastRefreshed} seconds ago</span>
      </div>
      {/* Techy System Log Table */}
      <div className="overflow-x-auto border border-slate-3000 rounded-md">
        <table className="w-full border-collapse font-mono text-slate-700">
          <thead className="border-b border-slate-300 bg-slate-300">
            <tr className="">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">PO Number</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={log.log_id} className={`border-b border-slate-300 bg-slate-200`}>
                <td className="p-2">{log.log_id}</td>
                <td className={`p-2 font-bold ${getLogColor(log.log_type)}`}>{log.log_type.toUpperCase()}</td>
                <td className="p-2">{log.zoho_po_number}</td>
                <td className="p-2 truncate max-w-[200px]">{log.log_message}</td>
                <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
