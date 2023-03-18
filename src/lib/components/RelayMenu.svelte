<script>
    import { nostrPool, relayEvents } from '$lib/store';
    import { onMount } from 'svelte';

    let displayRelayInfo = false;

    onMount(async () => {
        await $nostrPool.add('ws://localhost:8080');
        // await $nostrPool.add('wss://atlas.nostr.land');
        // await $nostrPool.add('wss://brb.io');
        // await $nostrPool.add('wss://nos.lol');
        // await $nostrPool.add('wss://relay.f7z.io');
        // await $nostrPool.add('wss://nostr-relay.aapi.me');
        // await $nostrPool.add('wss://nostr-relay.nokotaro.com');
        // await $nostrPool.add('wss://nostr.jatm.link');
        // await $nostrPool.add('wss://nostr1.tunnelsats.com');
        await $nostrPool.add('wss://relay.nostr.band');
        // await $nostrPool.add("wss://relay.snort.social");
        // await $nostrPool.add("wss://offchain.pub");
        // await $nostrPool.add("wss://nostr2.actn.io");
        // await $nostrPool.add("wss://nostr.lnprivate.network");
        // await $nostrPool.add("wss://nostr.com.de");
        // await $nostrPool.add("wss://relay.nostr.au");
        // await $nostrPool.add("wss://no.str.cr");
        // await $nostrPool.add("wss://1.noztr.com");
        // await $nostrPool.add("wss://nostr-verif.slothy.win");
        // await $nostrPool.add("wss://nostr-relay.digitalmob.ro");
        // await $nostrPool.add("wss://nostr.fractalized.ovh");
        // await $nostrPool.add("wss://relay.nostr.scot");
        // await $nostrPool.add("wss://relay.wellorder.net");
        // await $nostrPool.add("wss://nostr.bitcoin-21.org");
        // await $nostrPool.add("wss://nostr.bongbong.com");
        // await $nostrPool.add("wss://nostr.mom");
        // await $nostrPool.add("wss://nostr.ginuerzh.xyz");
        // await $nostrPool.add("wss://nostr.rocket-tech.net");
        // await $nostrPool.add("wss://nostr.8e23.net");
        // await $nostrPool.add("wss://nostr3.actn.io");
        // await $nostrPool.add("wss://nostr.radixrat.com");
        // await $nostrPool.add("wss://knostr.neutrine.com");
        // await $nostrPool.add("wss://nostr.cercatrova.me");
        // await $nostrPool.add("wss://nostr.cro.social");
        // await $nostrPool.add("wss://relay.nostr.bg");
        // await $nostrPool.add("wss://nostr.jatm.link");
        // await $nostrPool.add("wss://nostr.yuv.al");
        // await $nostrPool.add("wss://relay.austrich.net");
        await $nostrPool.add('wss://relay.damus.io');
        // await $nostrPool.add("wss://relay.valera.co");
        // await $nostrPool.add("wss://nostr.globals.fans");
        // await $nostrPool.add("wss://nostr.einundzwanzig.space");
        // await $nostrPool.add("wss://nostr.swiss-enigma.ch");
        // await $nostrPool.add("wss://nostr.wine");
        // await $nostrPool.add("wss://nostr.21crypto.ch");
        // await $nostrPool.add("wss://nostr.mustardnodes.com");
        // await $nostrPool.add("wss://nostr-pub.wellorder.net");
        // await $nostrPool.add("wss://nostr.walletofsatoshi.com");

        // try {
        //     const userRelays = await window.nostr?.getRelays()
        //     console.log('userRelays', userRelays, window.nostr);
        //     if (userRelays) {
        //         Object.keys(userRelays).forEach(relay => $nostrPool.add(relay))
        //     }
        // } catch (e) {
        //     console.log('error getting relays', e)
        // }
    });

    let relayUrls;
    $: relayUrls = Object.keys($relayEvents).filter((url) => url.match(/\/\//));

    async function addNewRelay(e) {
        const formData = new FormData(e.target);
        $nostrPool.add(formData.get('newRelay'));
        e.target.reset();
    }
</script>
