'use client';

import { useState, useEffect } from 'react';
import { Receipt } from '../../types/types';
import { getReceipts } from '~/server/queries';
import Icon from '../_components/icon-wrapper';
import React from 'react';
import Loader from '../_components/loader';
import ReceiptsDayChart from '../_components/receipts-day-chart';
import ReceiptsPieChart from '../_components/receipts-excess-chart';

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [head, setHead] = useState<number>(0);
  const fetchReceipts = async () => {
    const data = await getReceipts();
    setReceipts(data);
    setLoading(false);
    setHead(data.length-1);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);


  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredReceipts = receipts
    .filter((receipt) => receipt.zoho_po_number.includes(search))
    .filter((receipt) => filter === 'all' || receipt.status === filter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
    <div className='flex gap-4 w-full flex-grow'>
        <div className="p-6 bg-white w-[600px] flex-shrink-0 shadow-md rounded-xl">
            <h1 className="text-2xl flex font-semibold mb-4 text-gray-700">
                <Icon icon="receipt_long" className="mr-2" />
                Receipts
            </h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by PO Number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered bg-blue-50  rounded-lg w-full max-w-md shadow-sm"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="select select-bordered bg-blue-50 rounded-lg  w-32 shadow-sm"
                >
                    <option value="all">All</option>
                    <option value="excess">Excess</option>
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            {!loading ?
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">PO Number</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Created At</th>
                    <th className="px-4 py-2">Items</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReceipts.map((receipt) => (
                    <React.Fragment key={receipt.receipt_id}>
                        <tr
                            key={receipt.receipt_id}
                            onClick={() => toggleExpand(receipt.receipt_id)}
                            className={`cursor-pointer hover:bg-gray-50 border-b ${expanded === receipt.receipt_id && 'bg-gray-50'}`}
                        >
                            <td className="px-4 py-2 text-sm">{receipt.receipt_id}</td>
                            <td className="px-4 py-2 font-mono">{receipt.zoho_po_number}</td>
                            <td className={`px-2 py-1 text-sm text-white`}>
                                <p className={`px-2 py-1 text-center rounded-md capitalize ${
                                receipt.status === 'cleared'
                                    ? 'bg-green-500'
                                    : receipt.status === 'pending'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}>{receipt.status}</p>
                            </td>
                            <td className="px-4 py-2 text-sm">{new Date(receipt.created_at).toLocaleString()}</td>
                            <td className="px-4 py-2 flex items-center"><Icon icon='arrow_drop_down' className={`select-none duration-200 ${expanded === receipt.receipt_id ? 'rotate-180' : 'rotate-0'}`}/></td>
                        </tr>
                {expanded === receipt.receipt_id && (
                    <tr key={`expanded-${receipt.receipt_id}`} className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-2">
                        <div className="p-3 bg-white shadow-sm rounded-md">
                            {receipt.items && receipt.items.length > 0 ? (
                            <table className="table-auto w-full border">
                                <thead>
                                <tr className="text-sm font-mono">
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">Quantity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {receipt.items.map((item: { quantity: number; description: string }, index: number) => (
                                    <tr key={index} className="border-t text-sm">
                                    <td className="px-4 py-2">{item.description}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            ) : (
                            <p className="text-gray-500">No items available</p>
                            )}
                        </div>
                        </td>
                    </tr>
                    )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      : <div className="flex justify-center items-center h-48">
            <Loader/>
        </div>}
    </div>
    <div className='flex flex-col gap-4 flex-grow'>
        <div className='flex gap-4 bg-white rounded-lg shadow-md p-6'>
            <ReceiptsDayChart receipts={receipts}/>
            <ReceiptsPieChart receipts={receipts}/>
        </div>
        {head && (
        <div className="p-6 bg-white h-fit shadow-md rounded-lg">
            
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Latest Receipt</h2>
                <div className="w-full">
                <p><strong>PO Number:</strong> {receipts[head]?.zoho_po_number}</p>
                <p>
                    <strong>Status:</strong> 
                    <span className={receipts[head]?.status === 'cleared'
                        ? 'text-green-500 capitalize'
                        : receipts[head]?.status === 'pending'
                        ? 'text-yellow-500 capitalize'
                        : 'text-red-500 capitalize'
                    }> {receipts[head]?.status}</span>
                </p>
                <p>
                    <strong>Created At:</strong>
                    {receipts[head]?.created_at ? new Date(receipts[head].created_at).toLocaleString() : 'N/A'}
                </p>

                <h3 className="font-semibold text-gray-700 mt-3">Items</h3>
                {receipts[head]?.items?.length > 0 ? (
                <table className="table-auto w-full border">
                    <thead>
                    <tr className="text-sm font-mono">
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {receipts[head]?.items.map((item: { quantity: number; description: string }, index: number) => (
                        <tr key={index} className="border-t text-sm">
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        
                        </tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                    <p className="text-gray-500 mt-2">No items available</p>
                )}
                </div>
            </div>
            )}
        </div>
    </div>
  );
}
