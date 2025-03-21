"use client";
import { useEffect, useState } from "react";
import { Bill, Invoice } from "../../types/types";
import { getInvoicePDFs } from "~/server/aws"; // Your S3 invoices fetch function
import axios from "axios";
import Loader from "../_components/loader";
import PriceTierChart from "../_components/bill-price-chart";
import VendorBarChart from "../_components/bill-vendor-chart";
import StatusPieChart from "../_components/bill-status-chart";
import { getAllBills } from "~/server/zoho";

const ORGANIZATION_ID = process.env.NEXT_PUBLIC_ZOHO_ORG_ID; // e.g., "10234695"
// Note: The access token is handled in your zoho module

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch invoice PDFs from S3
  const fetchInvoicePDFs = async () => {
    try {
      const data = await getInvoicePDFs();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoice PDFs", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending invoices from Zoho Books API
  const [bills, setBills] = useState<Bill[]>([]);

  const fetchBills = async () => {
    try {
      // Adjust this endpoint as needed.
      const response = await getAllBills();
      if (response) {
        setBills(response.bills);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInvoicePDFs();
    fetchBills();
  }, []);

//   // Approve a pending invoice using its bill_id
//   const approveInvoice = async (bill_id: string) => {
//     try {
//       const approvalUrl = `https://www.zohoapis.com/books/v3/bills/${bill_id}/approve?organization_id=${ORGANIZATION_ID}`;
//       const response = await axios.post(approvalUrl, null, {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${process.env.NEXT_PUBLIC_ZOHO_ACCESS_TOKEN}`,
//         },
//       });
//       console.log("Approval response:", response.data);
//       // Optionally, refetch pending invoices to update the list
//       fetchPendingInvoices();
//     } catch (error: any) {
//       console.error("Error approving invoice:", error.response?.data || error.message);
//     }
//   };

  // Helper: Find the PDF URL for a given Zoho PO number from our invoices list
  const findPdfForPO = (poNumber?: string) => {
    if (!poNumber) return null;
    const match = invoices.find(inv => inv.zoho_po_number === poNumber);
    return match ? match.signed_url : null;
  };

  return (
    <div className="p-6 space-y-8">
      

        <div className="space-y-8">
            <h1 className="text-2xl font-bold mb-4">Bill Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StatusPieChart bills={bills} />
                <VendorBarChart bills={bills} />
            </div>
            <div>
                <PriceTierChart bills={bills} />
            </div>
        </div>
        {/* Invoice PDFs Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Invoice PDFs</h1>
        {loading ? (
          <div className="flex items-center justify-center w-full">
            <Loader />
          </div>
        ) : (
          <div >
            <input
              type="text"
              placeholder="Search by PO Number"
              className="input input-bordered max-w-lg bg-white bg-blue-50 mb-4 w-full"
              onChange={(e) => {
                const searchValue = e.target.value.toLowerCase();
                setInvoices((prevInvoices) =>
                  prevInvoices.filter((invoice) =>
                    invoice.zoho_po_number?.toLowerCase().includes(searchValue)
                  )
                );
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoices.map((invoice) => (
                <div key={invoice.invoice_id} className="border p-4 rounded-lg shadow-md">
                  <p className="font-semibold">PO Number: {invoice.zoho_po_number || "N/A"}</p>
                  <a
                    href={invoice.signed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-500 hover:underline"
                  >
                    Open PDF
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
