<script>
    import { totalsPerNote } from '$lib/store';
    export let note;
</script>

<div class="auctionStats mb-4 flex flex-row gap-4 text-lg md:text-2xl justify-center font-mono">
    {$totalsPerNote[note.id]?.count || 0} Total Bids (to be donated): {$totalsPerNote[note.id]
        ?.amount || 0} sats
</div>
