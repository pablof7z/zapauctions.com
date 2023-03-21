<script>
    import {
        nostrPool,
        nostrNotes,
        profiles,
        zapRequestsPerNote,
        zapRequests,
        loggedUser,
        zapsPerNote,
        zaps
    } from '$lib/store';
    import AuctionNote from '$lib/components/AuctionNote.svelte';

    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import AuctionStats from '$lib/components/AuctionStats.svelte';
    import Bid from '$lib/components/Bid.svelte';

    let noteId = $page.params.id;
    let sortedZaps;

    onMount(async () => {
        $nostrPool.subscribe([{ ids: [noteId] }], 10000);
        $nostrPool.subscribe([{ kinds: [9734], '#e': [noteId] }], 10000);
        $nostrPool.subscribe([{ kinds: [9735], '#e': [noteId] }], 10000);
    });

    $: {
        if ($zapsPerNote[noteId] && $zapsPerNote[noteId].length > 1) {
            sortedZaps = $zapsPerNote[noteId].sort((z1, z2) =>
                z1.amount < z2.amount ? 1 : z1.amount > z2.amount ? -1 : 0
            );
        }
    }

    function submit({ detail: formData }) {
        let data = {};

        for (let field of formData) {
            const [key, value] = field;

            if (key === 'comment') {
                data = value;
            }
        }
    }
</script>

<div
    class="auctionWrapper flex flex-col mx-8 md:flex-row gap-8 justify-center md:justify-around mt-6"
>
    <div class="auctionNote w-full md:w-2/5 overflow-hidden text-ellipsis">
        {#if $nostrNotes[noteId]}
            <AuctionNote note={$nostrNotes[noteId]} />
        {/if}
        {#if $nostrNotes[noteId]}
            <AuctionStats note={$nostrNotes[noteId]} {sortedZaps} />
        {/if}
    </div>

    <div class="bids w-full md:w-2/5">
        <div class="scrollContainer overflow-scroll max-h-screen">
            <h1 class="text-center mb-4 text-2xl md:text-3xl">Bids</h1>
            {#if sortedZaps}
                {#each Object.entries(sortedZaps) as [id, zap]}
                    <Bid {zap} opened={false} />
                {/each}
            {/if}
        </div>
    </div>
</div>
