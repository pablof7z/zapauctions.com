<script>
    import { nostrPool, nostrNotes, profiles, zapRequestsPerNote, zapRequests } from '$lib/store';
    import Note from '$lib/components/Note.svelte';
    import Zap from '$lib/components/Zap.svelte';

    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let noteId = $page.params.id;

    let sortedZapRequests;

    $: {
        if ($zapRequestsPerNote[noteId] && zapRequests) {
            sortedZapRequests = $zapRequestsPerNote[noteId].map(zapRequestId => $zapRequests[zapRequestId]);
            // sortedZapRequests = sortedZapRequests.sort((a, b) => b.amount - a.amount);
            sortedZapRequests = sortedZapRequests.sort((a, b) => a.created_at - b.created_at);
        }
    }

    onMount(async () => {
        $nostrPool.subscribe([
            {ids: noteId },
            {kinds:[9734], '#e': noteId},
        ], 10000);
    })

    function submit({detail: formData}) {
        let data = {}

        for (let field of formData) {
            const [key, value] = field;

            if (key === 'comment') {
                data = value;
            }
        }
    }
</script>

{#if $nostrNotes[noteId]}
    <Note note={$nostrNotes[noteId]} />
{/if}

<h1>bids</h1>

{#if $zapRequestsPerNote[noteId]}
    {#each sortedZapRequests as zapRequest}
        <pre>{zapRequest}</pre>
        <Zap zap={{event: zapRequest, ...zapRequest}} opened={false} />
    {/each}
{/if}