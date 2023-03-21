<script>
    import { profiles, totalsPerNote, zapsPerNote } from '$lib/store';
    import Avatar from '$lib/components/Avatar.svelte';
    import NoteContent from '$lib/components/NoteContent.svelte';
    import TimeAgo from 'javascript-time-ago'
    import { nip19 } from 'nostr-tools/index';
	import { formatSatoshis } from '$lib/utils';
    import { pubkeyName } from '$lib/nostr/utils';
    import ZapNote from './ZapNote.svelte';

    const timeAgo = new TimeAgo('en-US')

    export let note;

    let totalZaps;
    let zapraiseAmount, percentageZapped, raiseReached;
    let noteZaps;

    $: {
        noteZaps = $zapsPerNote[note.id] || []

        const content = note.content;
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(nip19.noteEncode(note.id))
    }
</script>

<div class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg p-4 w-full text-gray-700 dark:text-gray-100 flex flex-row max-h-96">
    <div class="flex flex-row overflow-scroll text-ellipsis flex-1 gap-4">
        <Avatar klass="ring-purple-900 m-2 w-16 h-16" pubkey={note.pubkey} />

        <div class="pl-6 flex flex-col text-ellipsis w-full overflow-scroll">
            <div class="font-bold text-xl text-clip">
                {pubkeyName(note.pubkey, $profiles)}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                {timeAgo.format(new Date(note.created_at * 1000))}
            </div>

            <div class="mt-5 overflow-scroll text-ellipsis flex-1">
                <NoteContent content={note.content} tags={note.tags} />
            </div>
        </div>

        <div class="flex flex-col justify-between">
            <div class="flex flex-col items-center justify-between w-full mt-5 gap-4">
                <!-- <a href="nostr:{nip19.noteEncode(note.id)}" class="
                    py-2
                    px-4
                    rounded-lg
                    bg-purple-900
                    text-white
                    w-full
                    text-center
                    text-sm
                ">Open</a>

                <button on:click={copyToClipboard} class="
                    py-2
                    px-4
                    rounded-lg
                    bg-purple-900
                    text-white
                    w-full
                    text-center
                    text-sm
                    whitespace-nowrap
                ">Copy Note ID</button> -->
                <ZapNote note={note} />
            </div>

        </div>

    </div>
</div>