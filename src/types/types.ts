// types/types.ts
export interface SystemLog {
    log_id: number;
    log_type: string;
    zoho_po_number: string;
    attachment?: any; // Adjust type if attachment structure is known
    log_message: string;
    created_at: string; // ISO string, e.g., "2023-10-01T12:00:00Z"
  }
  
  export interface RaiseFlag {
    flag_id: number;
    zoho_po_number: string | null;
    flag_type: string;
    flag_description: string;
    created_at: string;
  }
  
  export interface InvoiceStore {
    invoice_id: number;
    s3_url: string;
    zoho_po_number?: string;
    scanned_data?: any; // Adjust type if scanned_data structure is known
    zoho_bill_id?: string;
    created_at: string;
  }
  
  export interface Receipt {
    receipt_id: number;
    zoho_po_number: string;
    items?: any; // Adjust type if items structure is known
    status: string;
    created_at: string;
  }

  export interface Thresholds {
    category: string;
    min_rank_req: string;
    max_amount: number;
    min_amount: number;
  }