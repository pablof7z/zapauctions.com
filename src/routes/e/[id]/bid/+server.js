import {authenticatedLndGrpc, createHodlInvoice, subscribeToInvoice} from 'ln-service';
import { json } from '@sveltejs/kit';
import { relayInit } from 'nostr-tools';
import { LND_CERT, LND_MACAROON, LND_SOCKET } from '$env/static/private';

export async function GET ({url}) {
    const amount = url.searchParams.get('amount');
    let zapRequest = url.searchParams.get('nostr');
    zapRequest = JSON.parse(zapRequest);

    const {lnd} = authenticatedLndGrpc({
        cert: LND_CERT,
        macaroon: LND_MACAROON,
        socket: LND_SOCKET,
    });

    const {id, request} = await createHodlInvoice({
        lnd,
        tokens: amount / 1000,
    })

    // store id and request as kv in redis

    // Share the request with the payer and wait for a payment
    // const sub = subscribeToInvoice({id, lnd});

    // TODO on payment seen
    (async () => {
        const relay = relayInit('ws://localhost:8080');
        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`)
        })
        relay.on('notice', (e) => {
            console.log(`notice`, e)
        })
        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`)
        })
        await relay.connect()

        let pub = relay.publish(zapRequest)
        pub.on('ok', () => {
            console.log(`${relay.url} has accepted our event`)
        })
        pub.on('failed', reason => {
            console.log(`failed to publish to ${relay.url}: ${reason}`)
        })
    })();

    return json({
        "status": "OK",
        "successAction": {
            "tag": "message",
            "message": "Thanks, sats received!"
        },
        "routes": [],
        // "pr": request,
    })
}
