'use client'
import { useState, useEffect } from 'react';
import { InvoiceStore } from '../../types/types';

export default function Invoices() {
  const [invoices, setInvoices] = useState<InvoiceStore[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/invoices') // Replace with your API endpoint
      .then((res) => res.json())
      .then((data: InvoiceStore[]) => setInvoices(data));
  }, []);

  const filteredInvoices = invoices
    .filter((invoice) => {
      if (filter === 'with_scanned_data') return !!invoice.scanned_data;
      if (filter === 'with_bill_id') return !!invoice.zoho_bill_id;
      return true;
    })
    .filter(
      (invoice) =>
        (invoice.zoho_po_number?.includes(search) || !search) ||
        (invoice.zoho_bill_id?.includes(search) || !search)
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">PDF Invoices</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by PO Number or Bill ID"
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
          <option value="with_scanned_data">With Scanned Data</option>
          <option value="with_bill_id">With Bill ID</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>S3 URL</th>
              <th>PO Number</th>
              <th>Scanned Data</th>
              <th>Bill ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.invoice_id}>
                <td>{invoice.invoice_id}</td>
                <td>
                  <a href={invoice.s3_url} className="link" target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                </td>
                <td>{invoice.zoho_po_number || 'N/A'}</td>
                <td>{invoice.scanned_data ? 'Yes' : 'No'}</td>
                <td>{invoice.zoho_bill_id || 'N/A'}</td>
                <td>{new Date(invoice.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}