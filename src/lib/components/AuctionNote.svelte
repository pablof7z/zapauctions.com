<script>
    import { profiles, totalsPerNote, zapsPerNote } from '$lib/store';
    import Avatar from '$lib/components/Avatar.svelte';
    import NoteContent from '$lib/components/NoteContent.svelte';
    import TimeAgo from 'javascript-time-ago';
    import { nip19 } from 'nostr-tools/index';
    import { formatSatoshis } from '$lib/utils';
    import { pubkeyName } from '$lib/nostr/utils';
    import BidForm from './BidForm.svelte';

    const timeAgo = new TimeAgo('en-US');

    export let note;

    let totalZaps;
    let zapraiseAmount, percentageZapped, raiseReached;
    let noteZaps;

    $: {
        noteZaps = $zapsPerNote[note.id] || [];

        const content = note.content;
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(nip19.noteEncode(note.id));
    }
</script>

<div
    class="flex flex-col gap-4 justify-between bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg p-6 w-full text-gray-700 dark:text-gray-100"
>
    <div class="note text-xl text-white w-3/5">
        <NoteContent content={note.content} tags={note.tags} />
    </div>
    <div class="bidForm bg-white-200 dark:bg-gray-800 p-4 rounded-lg"><BidForm {note} /></div>
</div>
