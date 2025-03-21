"use server"
import axios from "axios";
import { Bill } from "~/types/types";


const ZOHO_API_BASE = "https://www.zohoapis.in/books/v3";
const TOKEN_URL = "https://accounts.zoho.in/oauth/v2/token";
const ORGANIZATION_ID = process.env.ZOHO_ORG_ID as string;
const CLIENT_ID = process.env.ZOHO_CLIENT_ID as string;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN as string;

let accessToken: string | null = null; // Stores the latest token in memory

/**
 * Refresh the Zoho OAuth access token
 */
async function refreshAccessToken(): Promise<string | null> {
  console.log("Refreshing Zoho access token...");
    console.log(REFRESH_TOKEN)
  try {
    const response = await axios.post(TOKEN_URL, null, {
      params: {
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
      },
    });

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      console.log("✅ Access token refreshed successfully.");
      return accessToken;
    } else {
      console.error("❌ Failed to refresh token:", response.data);
      return null;
    }
  } catch (error: any) {
    console.error("❌ Error refreshing token:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Fetch bills with status "pending_approval"
 */
async function getAllBills(): Promise<{ bills: Bill[] }> {
    if (!accessToken) {
      accessToken = await refreshAccessToken();
      if (!accessToken) throw new Error("Unable to obtain access token.");
    }
  
    try {
      let allBills: Bill[] = [];
      let page = 1;
      let hasMorePages = true;
  
      while (hasMorePages) {
        console.log(`Fetching bills (page ${page})...`);
        const response = await axios.get(`${ZOHO_API_BASE}/bills`, {
          params: {
            organization_id: ORGANIZATION_ID,
            page,
            per_page: 200, // Adjust if needed
          },
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        });
  
        if (response.data && response.data.bills) {
          // Map the raw bill objects to our Bill interface
          const bills: Bill[] = response.data.bills.map((bill: any) => ({
            bill_id: bill.bill_id,
            vendor_name: bill.vendor_name,
            status: bill.status,
            total: bill.total,
            // Map additional fields as necessary
          }));
  
          allBills = allBills.concat(bills);
  
          // Check if more pages are available
          hasMorePages = response.data.page_context?.has_more_page ?? false;
          page++;
        } else {
          hasMorePages = false;
        }
      }
  
      console.log(`✅ Retrieved ${allBills.length} bills from Zoho.`);
      return { bills: allBills };
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("⚠ Token expired, refreshing and retrying...");
        accessToken = await refreshAccessToken();
        return accessToken ? getAllBills() : { bills: [] };
      }
      console.error("❌ Error fetching bills:", error.response?.data || error.message);
      throw new Error("Error fetching bills");
    }
  }

// Export functions
export { refreshAccessToken, getAllBills };
