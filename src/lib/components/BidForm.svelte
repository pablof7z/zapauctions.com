<script>
    import { getEventHash } from 'nostr-tools';
    import axios from 'axios';
    import { requestProvider } from 'webln';
    import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';

    export let note;
    let amount, comment;

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

    async function makeBid() {
        let zapRequest = await getZapRequest(amount, comment);
        console.log(zapRequest);
        if (!zapRequest) return;

        zapRequest = encodeURIComponent(JSON.stringify(zapRequest));

        // console.log($nostrPool.pool.pool);
        // $nostrPool.pool.pool.send(['EVENT', zapRequest]);

        // const { data } = await axios.get(
        //     `https://d1538f2d25c5.ngrok.app/e/${note.id}/bid?amount=${
        //         amount * 1000
        //     }&nostr=${zapRequest}`
        // );
        // console.log(data);

        // const { pr } = data;

        // const webln = await requestProvider();
        // webln.sendPayment(pr);
    }
</script>

<div class="bidAccordian">
    <Disclosure>
        <DisclosureButton>Make a bid!</DisclosureButton>

        <DisclosurePanel>
            <form on:submit={makeBid} id="bid-form" class="flex flex-col gap-4 text-lg">
                <div class="form-group">
                    <label class="form-label" for="amount">Amount</label>
                    <input bind:value={amount} type="text" name="amount" class="form-input" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="comment">Bid Comment (optional)</label>
                    <input bind:value={comment} type="text" name="comment" class="form-input" />
                </div>

                <button
                    type="submit"
                    class="w-full text-center rounded-md border border-transparent bg-purple-900 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center"
                >
                    <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3 h-full" />
                    <div class="flex flex-col items-start">
                        <h1>Bid!</h1>
                        <!-- <h3 class="text-sm text-purple-200 font-light">(0 sats)</h3> -->
                    </div>
                </button>
            </form>
        </DisclosurePanel>
    </Disclosure>
</div>
