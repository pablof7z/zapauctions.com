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
        console.log('Relay menu');
        // await $nostrPool.add('wss://relay.nostr.band');
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
    <div
        class="flex flex-col bg-gray-50 text-gray-600 dark:text-gray-200 dark:bg-gray-900 min-h-screen font-sans antialiased"
    >
        <div class="flex flex-col w-full">
            <Header />
            <slot />
            <Footer />
        </div>
    </div>
</div>
