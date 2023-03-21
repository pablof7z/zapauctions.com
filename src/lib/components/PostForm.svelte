<script>
    import parse from 'date-fns/parse';
    import PostTypeSelector from './PostTypeSelector.svelte';
    import { nostrPool, nostrNotes, loggedUser } from '$lib/store';
    import { onMount } from 'svelte';
    import { validateEvent } from 'nostr-tools';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let ownPubkey = 'loading';
    let publishEventId;
    let subject, content;
    let startTime = Date.now(),
        endTime,
        blocksAfterEndTime,
        reservePrice;
    let endTimeChangedManually;
    let parsedDate;

    function startTimeChanged() {
        if (!endTimeChangedManually) {
            endTime = startTime;
        }
        parsedDate = new Date(startTime).valueOf() / 1000;
    }

    function endTimeChanged() {
        endTimeChangedManually = true;
    }

    onMount(async () => {
        try {
            ownPubkey = $loggedUser;
        } catch (e) {
            ownPubkey = null;
        }
    });

    function validate(data) {
        return true;
    }

    async function submit(e) {
        e.preventDefault();

        ownPubkey = $loggedUser;
        if (!ownPubkey) {
            alert('No nostr pubkey?');
            return;
        }

        let event = {
            content,
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            subject,
            tags: [
                ['startTime', startTime],
                ['endTime', endTime]
            ],
            pubkey: ownPubkey
        };
        // if (parseInt(blocksAfterEndTime) > 0) {
        //     event.tags.push(["blocksAfterEndTime", blocksAfterEndTime])
        // }

        // if (parseInt(reservePrice) > 0) {
        //     event.tags.push(["reservePrice", reservePrice])
        // }

        let { publishEvent } = await $nostrPool.signAndPublishEvent(event);
        publishEventId = publishEvent.id;
    }

    // hack? what hack?
    $: publishEventId && $nostrNotes[publishEventId] && dispatch('post', publishEventId);
</script>

<div class="my-4 w-full">
    {#if !ownPubkey}
        <div class="bottom-0 p-3 bg-red-600 border-red-800 border-8 text-white w-full text-center">
            <div class="flex justify-center flex-row items-center">
                <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.mR6qbzeucpJw74GqX5k8igHaEo%26pid%3DApi&f=1&ipt=84829f0f55dbaf2de493d3df75995f52abbe4d22b44d094924f54655a133137f&ipo=images"
                    alt=""
                    width="300"
                    class="mr-5"
                />
                <div class="flex-1">
                    <h1>NO NOSTR FOR YOU!</h1>
                    <p class="mt-5">
                        You can only use ZapAuction in read-only mode until you install a Nostr
                        extension.
                    </p>
                    <p class="mt-8">
                        <a
                            href="https://getalby.com"
                            class="bg-red-900 text-white px-4 py-2 text-xs rounded">Install Alby</a
                        >
                        <a
                            href="https://github.com/fiatjaf/nos2x"
                            class="bg-red-900 text-white px-4 py-2 text-xs rounded">Install Nos2x</a
                        >
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <form method="POST" action="?post" on:submit={submit} id="post-form">
            <h1>Create new auction</h1>

            <div class="my-3 ">
                <div>
                    <div class="my-3 flex-1 md:mr-1">
                        <label class="form-label" for="subject">Subject</label>
                        <input bind:value={subject} type="text" name="subject" class="form-input" />
                    </div>
                    <div class="flex flex-col">
                        <label class="form-label" for="content">Content</label>
                        <textarea
                            bind:value={content}
                            name="content"
                            cols="30"
                            rows="10"
                            class="form-input"
                        />
                    </div>
                    <div class="flex flex-col md:flex-row">
                        <div class="my-3 flex-1 md:mr-1">
                            <label for="startTime" class="form-label">Start time</label>
                            <input
                                bind:value={startTime}
                                on:change={startTimeChanged}
                                type="datetime-local"
                                name="startTime"
                                class="form-input"
                            />
                        </div>

                        <div class="my-3 flex-1 md:ml-1">
                            <label class="form-label" for="endTime">End time</label>
                            <input
                                bind:value={endTime}
                                on:change={endTimeChanged}
                                type="datetime-local"
                                name="endTime"
                                class="form-input"
                            />
                        </div>
                    </div>

                    <span>{parsedDate}</span>

                    <div class="my-3 flex-1 md:mr-1">
                        <label class="form-label" for="blocksAfterEndTime"
                            >Blocks after end time</label
                        >
                        <input
                            bind:value={blocksAfterEndTime}
                            type="number"
                            name="blocksAfterEndTime"
                            min="0"
                            class="form-input"
                        />
                        <span class="text-sm"
                            >(Optional) Randomize the end time with the timechain; wait this amount
                            of blocks after end time</span
                        >
                    </div>

                    <div class="my-3 flex-1 md:ml-1">
                        <label class="form-label" for="price">⚡️ Reserve price</label>
                        <input type="number" name="price" class="form-input" />
                        <span class="text-sm"
                            >(Optional) At least this amount of sats must be zapped</span
                        >
                    </div>
                </div>
            </div>

            <button
                type="submit"
                class="w-full text-center rounded-md border border-transparent bg-purple-900 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex flex-row items-center justify-center"
            >
                <img src="https://nostrica.com/images/shaka.png" alt="" class="mr-3 h-full" />
                <div class="flex flex-col items-start">
                    <h1>Post it!</h1>
                    <!-- <h3 class="text-sm text-purple-200 font-light">(0 sats)</h3> -->
                </div>
            </button>
        </form>
    {/if}
</div>
