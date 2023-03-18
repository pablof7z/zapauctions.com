<script>
    import { nostrNotes, zapraisers, totalsPerNote } from '$lib/store';
    import ZapraiserInfo from '$lib/components/ZapraiserInfo.svelte';
    import Note from '$lib/components/Note.svelte';

    let sortedZapraiserIds = [];

    $: {
        sortedZapraiserIds = $zapraisers.sort((a, b) => {
            return $totalsPerNote[b.id]?.count||0 - $totalsPerNote[a.id]?.count||0;
        });

        // make sortedZapraiserIds unique
        sortedZapraiserIds = [...new Set(sortedZapraiserIds)];
    }
</script>

<div class="flex flex-col gap-8 items-center">
    <ZapraiserInfo />
    
    {#if sortedZapraiserIds.length}
        {#each sortedZapraiserIds as noteId}
            {#if $nostrNotes[noteId] && !!$nostrNotes[noteId].zapraiseAmount}
                <Note note={$nostrNotes[noteId]} zapraise={true} />
            {/if}
        {/each}
    {/if}
</div>