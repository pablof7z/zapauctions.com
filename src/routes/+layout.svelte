<script>
    import TimeAgo from 'javascript-time-ago';
    import en from 'javascript-time-ago/locale/en';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { nostrPool, relayEvents } from '$lib/store';
    import { onMount } from 'svelte';
    import '../app.css';

    TimeAgo.addDefaultLocale(en);

    onMount(async () => {
        // await $nostrPool.add('wss://relay.nostr.band');
        // await $nostrPool.add('wss://522bda0c286d.ngrok.app');
        await $nostrPool.add('ws://localhost:8080');

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
</script>

<div class="wrapper">
    <div class="w-7/8 min-w-fit max-w-4xl mx-auto flex flex-col font-sans antialiased">
        <div class="flex flex-col w-full">
            <Header />
            <div
                class="mb-20 content-wrapper w-7/8 min-w-fit max-w-4xl mx-auto flex flex-col font-sans antialiased"
            >
                <slot />
            </div>
            <Footer />
        </div>
    </div>
</div>
