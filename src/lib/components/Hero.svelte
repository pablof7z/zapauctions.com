<script>
    import { get } from 'svelte/store'
    import { fade } from 'svelte/transition';
    import { zaps, nostrPool, nostrNotes, selectedDuration } from '$lib/store';
    import TimeframesSelector from '$lib/components/TimeframesSelector.svelte';
    import { subscribeMainFilter } from '$lib/nostr/utils';
    import { formatSatoshis } from '$lib/utils';
    import TimeAgo from 'javascript-time-ago'
	import { onMount } from 'svelte';
    const timeAgo = new TimeAgo('en-US')

    let totalSats;
    let durationInHours;
    let durationInHoursFormatted;
    let showTimeframes = false;
    let since;
    let hasSeenEvents;
    let showAllTimeWarning = false;

    $: {
        totalSats = $zaps.reduce((acc, zap) => {
            if (!since || zap.created_at >= since) {
                return acc + zap.amount
            } else {
                return acc;
            }
        }, 0);
    }

    onMount(() => {
        durationInHours = get(selectedDuration);
        setDuration();
        subscribeMainFilter($nostrPool, durationInHours);
    })

    function toggleTimeframes() {
        showTimeframes = !showTimeframes;
    }

    async function onTimeframeChange() {
        if (durationInHours === 'all') {
            showAllTimeWarning = true;
            setTimeout(() => {
                showAllTimeWarning = false;
            }, 5000);
        }
        
        $selectedDuration = durationInHours;

        $nostrPool.unsubscribeAll();
        await $nostrPool.reset();

        setDuration();
        toggleTimeframes();

        setTimeout(() => {
            subscribeMainFilter($nostrPool, durationInHours);
        }, 100);
    }

    function setDuration() {
        if (durationInHours !== 'all') {
            since = Math.floor(Date.now() / 1000) - durationInHours * 60 * 60;
            durationInHoursFormatted = timeAgo.format(new Date(since * 1000));
            durationInHoursFormatted = durationInHoursFormatted.replace(/ ago/, '')
        } else {
            since = null;
        }
    }

    hasSeenEvents = !!$nostrNotes[0];
</script>

{#if durationInHours}
    <div class="flex flex-col items-stretch justify-center my-10" style="min-height: 35vh;">
        <span class="
            text-7xl
            text-purple-600
            font-black
            text-center
            my-10
        ">
            <span class="hidden lg:inline-block">⚡️</span>
            {formatSatoshis(parseInt(totalSats))}
        </span>
        <span class="
            text-3xl
            text-gray-700 dark:text-gray-300
            font-black
            text-center
            mb-3
        ">zapped</span>

        <div class="text-center flex flex-col items-center text-xl text-gray-500 font-bold">
            {#if durationInHours !== 'all'}
                <span class="">
                    in the past
                    <a href='#' class="
                        border-b-2
                        border-dashed
                        border-b-gray-500
                        cursor-pointer
                        hover:dark:text-white
                        hover:dark:border-b-white
                    " on:click|preventDefault={toggleTimeframes}>
                        {durationInHoursFormatted}
                    </a>
                </span>
            {:else}
                <a href='#' class="
                    border-b-2
                    border-dashed
                    border-b-purple-800
                    cursor-pointer
                    hover:dark:text-white
                    hover:dark:border-b-white
                    " on:click|preventDefault={toggleTimeframes}
                >
                    ALL TIME
                </a>
                {#if showAllTimeWarning}
                    <div class="flex flex-row gap-2 items-center">
                        <img src="https://nostr.build/i/nostr.build_6b1887818fff90848ba4a8ffd21094b5e169044aea2091f5d59491c4af024971.png" alt="" class="h-12 rounded-md">
                        <span in:fade out:fade class="text-red-600 text-sm font-mono opacity-70">
                            (gathering events live;<br/>it'll take a while)
                        </span>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
{:else}
    <div class="flex flex-col items-stretch justify-center my-10" style="min-height: 35vh;">
        <span class="
            text-7xl
            text-purple-700
            font-black
            text-center
            my-10
        ">
            👋 HOWDY!
        </span>
        <span class="
            text-3xl
            text-gray-700 dark:text-gray-300
            font-black
            text-center
            mb-3
        ">connecting you to relays, one sec</span>
    </div>
{/if}

{#if showTimeframes}
    <div class="mb-32 text-lg" style="">
        <div class="flex flex-col lg:flex-row">
            <TimeframesSelector
                hour={durationInHours}
                bind:hours={durationInHours}
                click={onTimeframeChange}
            />
        </div>
    </div>
{/if}