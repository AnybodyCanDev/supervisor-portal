"use server"
import { db } from './db';

export async function getReceipts() {
    const receipts = await db.receiptTable.findMany();
    return receipts.map(receipt => ({
        ...receipt,
        created_at: receipt.created_at.toISOString(), // Convert Date to string
    }));
}

export async function getLogs() {
    const logs = await db.systemLogs.findMany();
    return logs.map(log => ({
        ...log,
        created_at: log.created_at.toISOString(), // Convert Date to string
    }));
}

export async function getFlags() {
    const flags = await db.raiseFlags.findMany();
    return flags.map(flag => ({
        ...flag,
        created_at: flag.created_at.toISOString(), // Convert Date to string
    }));
}

export async function getThresholds() {
    const thresholds = await db.threshold.findMany();
    return thresholds;
}

export async function updateThreshold(category: string, min_rank_req: string, newMaxAmount: number) {
    try {
        const updatedThreshold = await db.threshold.updateMany({
            where: {
                category,
                min_rank_req
            },
            data: {
                max_amount: newMaxAmount
            }
        });

        return updatedThreshold;
    } catch (error) {
        console.error("Error updating threshold:", error);
        throw new Error("Failed to update threshold");
    }
}
