"use server"
import AWS from 'aws-sdk';
import { db } from '~/server/db'; // Assuming Prisma setup

interface Invoice {
    invoice_id: string;
    signed_url: string;
    zoho_po_number?: string;
}

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export async function getInvoicePDFs() {
    try {
        const invoices = await db.invoiceStore.findMany();

        const signedUrls = invoices
            .map(invoice => {
                if (!invoice.s3_url) return null;

                let bucketName = "";
                let objectKey = "";

                try {
                    if (invoice.s3_url.startsWith("s3://")) {
                        // Extract bucket name and object key from S3 URI format
                        const parts = invoice.s3_url.replace("s3://", "").split("/");
                        bucketName = parts.shift()!; // First part is the bucket name
                        objectKey = parts.join("/"); // Rest is the object key
                    } else {
                        throw new Error("Invalid S3 URL format");
                    }

                    // Generate signed URL
                    const signedUrl = s3.getSignedUrl("getObject", {
                        Bucket: bucketName,
                        Key: objectKey,
                        Expires: 3600, // 1 hour expiry
                    });

                    return {
                        invoice_id: invoice.invoice_id,
                        signed_url: signedUrl,
                        zoho_po_number: invoice.zoho_po_number,
                    };
                } catch (error) {
                    console.error("Error parsing S3 URI:", invoice.s3_url, error);
                    return null; // Skip invalid URLs
                }
            })
            .filter(invoice => invoice !== null) as Invoice[];

        return signedUrls;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw new Error("Failed to retrieve invoice PDFs");
    }
}


