<script>
    import { totalsPerNote } from '$lib/store';
    import { formatSatoshis } from '$lib/utils';
    export let note, topBid;
    export let sortedZaps;
    $: {
        if (sortedZaps?.length > 1) {
            topBid = sortedZaps[0].amount;
        }
    }
</script>

<div
    class="stats-wrapper flex flex-col gap-6
    text-2xl md:text-2xl font-mono
    bg-gray-200 dark:bg-purple-900 p-4
    rounded-lg my-6"
>
    <div>
        <span class="font-sans">🤙</span> Current highest bid:
        <span class="font-bold">
            {#if topBid}
                {formatSatoshis(topBid, { tryGrouping: true })}
            {:else}
                Be the first!
            {/if}
        </span>
    </div>
    <div>
        <span class="font-sans">🤑</span>
        <span class="font-bold">
            {#if topBid}
                {formatSatoshis($totalsPerNote[note.id]?.amount || 0, { tryGrouping: true })}
            {:else}
                Nothing
            {/if}
        </span> will be donated
    </div>
    <div>
        <span class="font-sans">🥳</span> From
        <span class="font-bold">{$totalsPerNote[note.id]?.count || 0} total bids</span>
    </div>
</div>
