<script>
    import { nostrPool, nostrNotes, profiles } from '$lib/store';
    import { getEventHash } from 'nostr-tools';
    import axios from 'axios';
    import { requestProvider } from 'webln';

    export let note;

    async function getZapRequest(amountInSats, content) {
        let zapRequestEvent = {
            kind: 9374,
            created_at: Math.floor(Date.now() / 1000),
            pubkey: await window.nostr.getPublicKey(),
            tags: [
                ['e', note.id],
                ['p', note.pubkey],
                ['relays', 'wss://relay.f7z.io', 'wss://relay.nostr.band'],
                ['amount', `${amountInSats * 1000}`]
            ],
            content: content || ''
        };

        zapRequestEvent.id = getEventHash(zapRequestEvent);
        zapRequestEvent = await window.nostr.signEvent(zapRequestEvent);

        return zapRequestEvent;
    }

    async function zap() {
        const amount = prompt(`How much do you want to bid? (in sats)`);
        const content = prompt(`Zap comment?`);
        let zapRequest = await getZapRequest(amount, content);
        console.log(zapRequest);
        if (!zapRequest) return;

        zapRequest = encodeURIComponent(JSON.stringify(zapRequest));

        // console.log($nostrPool.pool.pool);
        // $nostrPool.pool.pool.send(['EVENT', zapRequest]);

        const { data } = await axios.get(
            `https://d1538f2d25c5.ngrok.app/e/${note.id}/bid?amount=${
                amount * 1000
            }&nostr=${zapRequest}`
        );
        console.log(data);

        const { pr } = data;

        const webln = await requestProvider();
        webln.sendPayment(pr);
    }
</script>

<button
    class="bg-purple-600 text-white px-8 py-2 font-bold text-xl flex-1 md:flex-0"
    on:click={zap}
>
    ⚡️ ZAP IT
</button>
