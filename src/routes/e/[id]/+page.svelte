<script>
    import { nostrPool, nostrNotes, profiles, zapRequestsPerNote, zapRequests } from '$lib/store';
    import AuctionNote from '$lib/components/AuctionNote.svelte';
    import Zap from '$lib/components/Zap.svelte';

    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import AuctionStats from '$lib/components/AuctionStats.svelte';

    let noteId = $page.params.id;

    let sortedZapRequests;

    $: {
        if ($zapRequestsPerNote[noteId] && zapRequests) {
            sortedZapRequests = $zapRequestsPerNote[noteId].map(
                (zapRequestId) => $zapRequests[zapRequestId]
            );
            // sortedZapRequests = sortedZapRequests.sort((a, b) => b.amount - a.amount);
            sortedZapRequests = sortedZapRequests.sort((a, b) => a.created_at - b.created_at);
        }
    }

    onMount(async () => {
        $nostrPool.subscribe([{ ids: noteId }, { kinds: [9734], '#e': noteId }], 10000);
    });

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

<h1 class="text-center mt-8 mb-4 text-2xl md:text-3xl">Active Auction</h1>
{#if $nostrNotes[noteId]}
    <AuctionStats note={$nostrNotes[noteId]} />
{/if}

<div class="auctionWrapper" />
{#if $nostrNotes[noteId]}
    <AuctionNote note={$nostrNotes[noteId]} />
{/if}

<h1 class="text-center mt-8 mb-4 text-2xl md:text-3xl">Bids</h1>

{#if $zapRequestsPerNote[noteId]}
    {#each sortedZapRequests as zapRequest}
        <Zap zap={{ event: zapRequest, ...zapRequest }} opened={false} />
    {/each}
{/if}
