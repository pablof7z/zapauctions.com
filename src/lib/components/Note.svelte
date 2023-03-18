<script>
    import { profiles, totalsPerNote, zapsPerNote } from '$lib/store';
    import Avatar from '$lib/components/Avatar.svelte';
    import NoteContent from '$lib/components/NoteContent.svelte';
    import TimeAgo from 'javascript-time-ago'
    import { nip19 } from 'nostr-tools/index';
	import { formatSatoshis } from '$lib/utils';
    import { pubkeyName } from '$lib/nostr/utils';

    const timeAgo = new TimeAgo('en-US')

    export let note;
    export let zapraise = null;

    let totalZaps;
    let zapraiseAmount, percentageZapped, raiseReached;
    let noteZaps;

    $: {
        totalZaps = $totalsPerNote[note.id]
        noteZaps = $zapsPerNote[note.id] || []

        const content = note.content;
        const zapraiseRegex = /#[t]*zapraiser\s+(\d+)([kKmM(btc|BTC)]*)/;
        
        const match = content.match(zapraiseRegex);
        if (match) {
            const amount = parseInt(match[1]);
            const multiplier = match[2];
            if (multiplier === 'k' || multiplier === 'K') {
                zapraiseAmount = amount * 1000;
            } else if (multiplier === 'm' || multiplier === 'M') {
                zapraiseAmount = amount * 1000000;
            } else if (multiplier === 'btc' || multiplier === 'BTC') {
                zapraiseAmount = amount * 100000000;
            } else {
                zapraiseAmount = amount;
            }
        } else {
            zapraiseAmount = 0;
        }

        const totalZapped = totalZaps?.amount || 0;

        if (zapraiseAmount === 0) {
            percentageZapped = 0;
        } else {
            percentageZapped = Math.round(totalZapped / zapraiseAmount * 100);
        }

        raiseReached = percentageZapped >= 100;
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

            {#if zapraise}
                <div class="flex flex-row items-center gap-4">
                    <div class="flex-1">
                        <div class="overflow-hidden rounded-full bg-gray-200 justify-self-end flex-1">
                            <div class="h-2 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-800" style="width: {percentageZapped}%"></div>
                        </div>
                    </div>

                
                    <div class="
                        flex flex-col w-fit items-center bg-slate-50 dark:bg-gray-900 dark:border dark:border-gray-700 px-2 py-2 rounded-lg text-gray-500
                    ">
                        <div class="
                            text-2xl font-black 
                            {raiseReached ? 'text-purple-600' : 'text-black dark:text-gray-300'}
                        ">
                            {formatSatoshis(zapraiseAmount, {tryGrouping: true, justNumber: true})}
                        </div>
                        <div class="text-sm opacity-80">
                            {formatSatoshis(zapraiseAmount, {tryGrouping: true, justUnit: true})}
                        </div>
                    </div>
                </div>
            {/if}

            <div class="flex flex-row mt-5">
                {#if noteZaps.length < 5}
                    {#each noteZaps as zap}
                        <!-- <a href="" title={zap.sender?.name}> -->
                            <Avatar klass="w-8 h-8" pubkey={zap.sender} />
                        <!-- </a> -->
                    {/each}
                {/if}
            </div>
        </div>

        <div class="flex flex-col justify-between">
            <div class="flex flex-col items-center justify-between w-full mt-5 gap-4">
                <div class="flex flex-col items-center bg-slate-50 dark:bg-gray-900 dark:border dark:border-gray-700 w-full px-5 py-2 rounded-lg text-gray-500">
                <div class="text-2xl font-black text-black dark:text-gray-300">
                    {totalZaps?.count || 0}
                </div>
                <div class="text-sm opacity-80">
                    zaps
                </div>
                </div>

                <div class="flex flex-col items-center bg-slate-50 dark:bg-gray-900 dark:border dark:border-gray-700 w-full px-2 py-2 rounded-lg text-gray-500">
                    <div class="text-2xl font-black text-black dark:text-gray-300">
                        {formatSatoshis(totalZaps?.amount||0, {tryGrouping: true, justNumber: true})}
                    </div>
                    <div class="text-sm opacity-80">
                        {formatSatoshis(totalZaps?.amount||0, {tryGrouping: true, justUnit: true})}
                    </div>
                </div>

                <a href="nostr:{nip19.noteEncode(note.id)}" class="
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
                ">Copy Note ID</button>
            </div>
        </div>
    </div>
</div>