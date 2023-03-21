import {authenticatedLndGrpc, createHodlInvoice, subscribeToInvoice, settleHodlInvoice, cancelHodlInvoice} from 'ln-service';
import { json } from '@sveltejs/kit';
import { relayInit, getEventHash, generatePrivateKey, getPublicKey, signEvent } from 'nostr-tools';
import { LND_CERT, LND_MACAROON, LND_SOCKET, LND_NOSTR_KEY } from '$env/static/private';
import { saveZapRequest, saveInvoiceSecret } from '$lib/database';

async function publishEvent(event) {
    const relay = relayInit('ws://localhost:8080');
    await relay.connect()

    let pub = relay.publish(event)
    pub.on('ok', async () => {
        console.log(`${relay.url} has accepted our event`)
        await relay.close()
    })
    pub.on('failed', async (reason) => {
        console.log(`failed to publish to ${relay.url}: ${reason}`)
        await relay.close()
    })
}

export async function GET ({url}) {
    const amount = url.searchParams.get('amount');
    let zapRequest = url.searchParams.get('nostr');
    zapRequest = JSON.parse(zapRequest);
    const zappedNote = zapRequest.tags.find(tag => tag[0] === 'e')[1];

    if (!LND_CERT) {
        return json({
            "status": "ERROR",
            "errorCode": "NO_LND_CERT",
            "errorMessage": "LND certificate not found"
        })
    }

    const {lnd} = authenticatedLndGrpc({
        cert: LND_CERT,
        macaroon: LND_MACAROON,
        socket: LND_SOCKET,
    });

    const req = await createHodlInvoice({
        lnd,
        tokens: amount / 1000,
    })

    const {id, request, secret} = req;

    saveInvoiceSecret(zappedNote, id, secret.toString('hex'))

    // store id and request as kv in redis

    // Share the request with the payer and wait for a payment
    const sub = subscribeToInvoice({id, lnd});

    sub.on('invoice_updated', async invoice => {
        if (!invoice.is_held) { return; }

        await saveZapRequest(zappedNote, zapRequest, amount / 1000, id, secret.toString('hex'))
        await publishEvent(zapRequest);

        // Use the secret to claim the funds
        // await settleHodlInvoice({lnd, secret: secret.toString('hex')});

        // setTimeout(async () => {
        //     await cancelHodlInvoice({id, lnd});
        //     try {
        //         let deleteEvent = {
        //             kind: 5,
        //             created_at: Math.floor(Date.now() / 1000),
        //             pubkey: getPublicKey(LND_NOSTR_KEY),
        //             tags: [
        //                 [ 'e', zapRequest.id ]
        //             ],
        //             content: "Bid expired"
        //         }
        //         console.log(deleteEvent);
        //         deleteEvent.id = getEventHash(deleteEvent);
        //         deleteEvent.sig = signEvent(deleteEvent, LND_NOSTR_KEY);
        //         console.log(deleteEvent);
        //         await publishEvent(deleteEvent);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }, 2500);
    });

    return json({
        "status": "OK",
        "successAction": {
            "tag": "message",
            "message": "Thanks, sats received!"
        },
        "routes": [],
        "pr": request,
    })
}
