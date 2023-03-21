import { createClient } from 'redis';

export async function saveZapRequest(zapAuctionId, zapRequest, amount, invoiceId, invoiceSecret) {
    const client = createClient();
    await client.connect();

    console.log({amount});

    await client.ZADD(`zapped-amounts:${zapAuctionId}`, { score: amount, value: JSON.stringify(zapRequest) });
    await client.HSET(`invoice-secrets:${zapAuctionId}`, invoiceId, invoiceSecret);
    await client.disconnect();
}

export async function saveInvoiceSecret(zapAuctionId, invoiceId, invoiceSecret) {
    const client = createClient();
    await client.connect();

    await client.HSET(`invoice-secrets:${zapAuctionId}`, invoiceId, invoiceSecret);
    await client.disconnect();
}
