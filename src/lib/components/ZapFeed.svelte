<script>
    import { zaps } from '$lib/store';
    import Zap from '$lib/components/Zap.svelte';

    let visibleZaps = [];
    let initialLoad = true;
    let openedZap;

    // this is done to prevent loading a bunch of zaps before we
    // finished loading, so as to initially respect the limit of n
    // zaps, and disregard it as they continue to come in
    // setTimeout(() => { initialLoad = false; }, 1500);

    $: {
        const cutoffTime = Math.floor(Date.now() / 1000) - 1 * 60 * 60;
        let sortedZaps = $zaps
        sortedZaps = sortedZaps.filter(post => post.created_at > cutoffTime)
        sortedZaps = sortedZaps.sort((a, b) => b.created_at - a.created_at);
    
        // under the initial load, we want to constrain the number of zaps we load
        // if (initialLoad) {
        //     visibleZaps = sortedZaps.slice(0, 100);
        // } else {
            sortedZaps.slice(0, 50).reverse().forEach((zap) => {
                if (!visibleZaps.find(z => z.event.id === zap.event.id)) {
                    visibleZaps.unshift(zap);
                }
            })
        // }

        visibleZaps = visibleZaps;
    }
</script>

{#each visibleZaps as zap}
    <Zap {zap} opened={openedZap === zap.id} on:open={(e) => { openedZap = e.detail } } />
{/each}