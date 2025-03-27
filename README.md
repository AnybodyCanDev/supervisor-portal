# Supervisor panel for Digital Invoice Processing

## Team abcd - AnybodyCanDevelop

#### Members:

* Karan Prasad Hathwar [gh](https://github.com/musashi-13)
* Kriti Bharadwaj [gh](https://github.com/gypsybozo)
* Lakshya Vijay [gh](https://github.com/laksxya)
* Keya Kesani [gh](https://github.com/keya161)

### How to Run

Clone the project into your folder

```bash
  git clone https://github.com/AnybodyCanDev/supervisor-portal
  cd supervisor-portal
```
    
Create a `.env` file based on the `env.example` file and fill in the keys.

Install packages and run the project using `npm` or `pnpm`

```bash
  npm install
  npm run dev
```

### Functions

* View system logs.
* View flags raised by the system.
* View and update thresholds for each category for each level for dynamic hierarchy.
* View analytics of the current bills in ZOHO and access the pdfs of invoices stored in s3.
* View all receipts that have been processed and the ratio of cleared and excess receipts.

### API Reference

### Authentication
All API requests require an API keys mentioned in the `env.example` file for authentication. 

---

### Zoho Books API

#### Refresh Access Token
```http
POST /api/zoho/refresh-token
```
**Description**: Refreshes the Zoho OAuth access token.

**Response:**
```json
{
  "access_token": "new_access_token",
  "expires_in": 3600
}
```

---

#### Get All Bills
```http
GET /api/zoho/bills
```
**Description**: Fetches all bills with status `pending_approval`.

| Parameter       | Type   | Description                  |
|---------------|--------|------------------------------|
| `api_key`     | string | **Required**. Your API key   |

**Response:**
```json
{
  "bills": [
    {
      "bill_id": "12345",
      "vendor_name": "ABC Corp",
      "status": "pending_approval",
      "total": 1000.50
    }
  ]
}
```

---

### Database API

#### Get Receipts
```ts
getReceipts()
```
**Description**: Fetches all stored receipts.

**Response:**
```json
[
  {
    "receipt_id": 1,
    "zoho_po_number": "PO-12345",
    "items": null,
    "status": "Processed",
    "created_at": "2025-03-27T10:00:00Z"
  }
]
```

---

#### Get System Logs
```ts
getLogs()
```
**Description**: Retrieves system logs.

**Response:**
```json
[
  {
    "log_id": 101,
    "log_type": "INFO",
    "zoho_po_number": "PO-12345",
    "attachment": null,
    "log_message": "System initialized",
    "created_at": "2025-03-27T08:30:00Z"
  }
]
```

#### Get Approval Thresholds
```ts
getThresholds()
```
**Description**: Retrieves the thresholds for dynamic approval hierarchy.

**Response:**
```json
[
  {
    "category": "Finance",
    "min_rank_req": "Manager",
    "max_amount": 5000,
    "min_amount": 1000
  }
]
```

---

#### Get Flags
```ts
getFlags()
```
**Description**: Fetches all raised flags.

**Response:**
```json
[
  {
    "flag_id": 501,
    "zoho_po_number": "PO-67890",
    "flag_type": "Fraud Alert",
    "flag_description": "Suspicious transaction detected",
    "created_at": "2025-03-27T12:45:00Z"
  }
]
```

#### Update Thresholds
```ts
updateThreshold(category: string, min_rank_req: string, newMaxAmount: number)
```
**Description**: Updates the threshold value based on the user requirements for approval hierarchy.

**Response:**
```json
{
  "updated": true
}
```

---

### AWS S3 API

#### Get Invoice PDFs
```http
GET /api/invoices
```
**Description**: Retrieves signed URLs for invoice PDFs stored in AWS S3.

**Response:**
```json
[
  {
    "invoice_id": "INV123",
    "signed_url": "https://signed-url.com/invoice.pdf",
    "zoho_po_number": "PO9876"
  }
]
```

