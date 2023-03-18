<script>
    import Avatar from '$lib/components/Avatar.svelte';
    import Note from '$lib/components/Note.svelte';
    import { profiles, nostrNotes } from '$lib/store';
    import { nostrPool } from '$lib/store';
    import { formatSatoshis } from '$lib/utils';
    import { nip19 } from 'nostr-tools/index';
    import TimeAgo from 'javascript-time-ago'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let zap;
    export let opened;

    let zappedNote;

    let ago;

    $: {
        try {
            const timeAgo = new TimeAgo('en-US')
            ago = timeAgo.format(new Date(zap.event.created_at * 1000))
        } catch (e) {
            console.log(e)
        }
    }

    $: zappedNote = zap.zappedNoteId ? $nostrNotes[zap.zappedNoteId] : null;

    let senderName, recipientName;

    $: senderName = $profiles[zap.sender]?.name || zap.sender;
    $: recipientName = $profiles[zap.recipient]?.name || zap.recipient;

    function open() {
        $nostrPool.reqEvent(zap.zappedNoteId, 0)
        dispatch('open', opened ? null : zap.id);
    }

    function zapContent(content) {
        // if it's an URL that ends with an image format
        if (content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g)) {
            return `<img src="${content}" class="max-h-64" />`
            // else if url is youtube
        } else if (content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:youtube)/g)) {
            return `<iframe width="560" height="315" src="${content}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
            // else if url is vimeo
        } else if (content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:vimeo)/g)) {
            return `<iframe src="${content}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
            // else if url is mp4
        } else if (content.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:mov)/g)) {
            return `<video controls class="max-h-64">
                <source src="${content}" type="video/mp4">
                Your browser does not support the video tag.`
        } else {
            return content;
        }
    }
</script>

{#if opened}
    {#if zappedNote}
        <Note note={zappedNote} />
    {:else if zap.zappedNoteId}
        <div>
            Loading note
            <a href="nostr:{nip19.noteEncode(zap.zappedNoteId)}" class="
            py-2
            px-4
            rounded-lg
            bg-purple-900
            text-white
            text-sm">Open</a>
        </div>
    {:else}
        <div class="my-5">
            <a href="nostr:{nip19.npubEncode(zap.recipient)}" class="
            py-2
            px-4
            my-5
            rounded-lg
            bg-purple-900
            text-white
            text-sm">Open Profile</a>
        </div>
    {/if}
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="
    flex flex-col py-1  w-full
    hover:bg-purple-50 dark:hover:bg-purple-1000
    {opened ? 'bg-purple-100 dark:bg-purple-900 border border-purple-900' : 'bg-white dark:bg-gray-900'}
    cursor-pointer md:mb-4 md:rounded md:shadow border-b-gray-300 dark:border-b-gray-800 border-b amax-h-24
    items-center
    justify-between
    text-gray-600 dark:text-gray-200
    px-4
" on:click={open}>
    <div class="flex flex-row gap-1 w-full py-4">
        <div class="w-1/3 flex flex-row items-center gap-2">
            <Avatar klass="m-2 w-16 h-16 ring-8 ring-purple-1000" pubkey={zap.sender} />
            <div class="font-bold text-xl text-clip hidden sm:block overflow-scroll">
                <span class="w-16">{senderName}</span>
            </div>
        </div>

        <div class="w-1/3 flex flex-col items-center">
            <div class="text-5xl font-black text-center justify-center flex flex-row items-center">
                ⚡️
                <span class="flex flex-col items-center">
                    <span class="text-purple-900 dark:text-purple-500">{formatSatoshis(zap.amount, { tryGrouping: true, justNumber: true })}</span>
                    <span class="text-lg text-gray-600 dark:text-gray-300 font-black uppercase">{formatSatoshis(zap.amount, { tryGrouping: true, justUnit: true })}</span>
                </span>
            </div>

            <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                {ago}
            </div>
        </div>

        <div class="w-1/3 flex flex-row gap-2 justify-end items-center">
            <div class="font-bold text-xl text-clip hidden sm:block overflow-hidden text-right">
                {recipientName}
            </div>
            <Avatar klass="m-2 w-16 h-16 ring-8 ring-purple-1000" pubkey={zap.recipient} />
        </div>
    </div>

    {#if zap.content}
        <div class="
            border border-purple-500 dark:border-purple-900
            bg-purple-100 dark:bg-slate-800
            text-black dark:text-white
            p-3
            w-full
            text-center
            rounded-lg
            items-center
            justify-center
            overflow-clip
            flex flex-row
            m-3
        ">{#if zapContent(zap.content)}{@html zapContent(zap.content)}{/if}</div>
    {/if}
</div>