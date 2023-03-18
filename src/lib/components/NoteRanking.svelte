<script>
    import { nostrPool, nostrNotes, totalsPerNote } from '$lib/store';
    import Note from '$lib/components/Note.svelte';

    export let sortMode;

    let sortedNoteIds = {};
    let recentlyRequestedNotes = false;

    function requestMissingNotes() {
        if (recentlyRequestedNotes) { return; }
        recentlyRequestedNotes = true;
        setTimeout(() => { recentlyRequestedNotes = false; }, 10000);

        const missingNotes = sortedNoteIds.filter(id => !$nostrNotes[id]);

        if (missingNotes.length > 0) {
            $nostrPool.subscribe([ {ids: missingNotes }, {kinds:[9735], '#e': missingNotes}], 10000);
        }
    }

    $: {
        if (sortMode === 'count') {
            sortedNoteIds = Object.keys($totalsPerNote).sort((a, b) => {
                return $totalsPerNote[b].count - $totalsPerNote[a].count;
            });
        } else if (sortMode === 'amount') {
            sortedNoteIds = Object.keys($totalsPerNote).sort((a, b) => {
                return $totalsPerNote[b].amount - $totalsPerNote[a].amount;
            });
        }

        // go through the sortedNoteIds and remove any that their $nostrNotes[id].zapraiseAmount is set
        sortedNoteIds = sortedNoteIds.filter(id => !$nostrNotes[id] || !!!$nostrNotes[id].zapraiseAmount);

        sortedNoteIds = sortedNoteIds.slice(0, 100)

        requestMissingNotes();
    }
</script>

<div class="flex flex-col gap-8">
    {#each sortedNoteIds as noteId, i}
        {#if $nostrNotes[noteId]}
            <Note note={$nostrNotes[noteId]} />
        {/if}
    {/each}
</div>