<script>
    import Note from '$lib/components/Note.svelte';
    import { nostrNotes, nostrPool } from '$lib/store';
    import { onMount } from 'svelte';

    onMount(() => {
        $nostrPool.subscribe([{ kinds: [1] }], 10000);
    });
    console.log($nostrNotes);
</script>

<svelte:head>
    <title>ZapAuction</title>
</svelte:head>

{#each Object.entries($nostrNotes) as [id, note]}
    <Note {note} />
{/each}
