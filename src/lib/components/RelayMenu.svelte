<script>
    import { nostrPool, relayEvents } from '$lib/store';

    let displayRelayInfo = false;

    let relayUrls;
    $: relayUrls = Object.keys($relayEvents).filter((url) => url.match(/\/\//));

    async function addNewRelay(e) {
        const formData = new FormData(e.target);
        $nostrPool.add(formData.get('newRelay'));
        e.target.reset();
    }
</script>

<h1 class="font-bold text-lg mb-3">Relays</h1>

<ul class="list-none">
    {#each relayUrls as relayUrl}
        <li>
            <b>{relayUrl}:</b>
            {$relayEvents[relayUrl]} events
        </li>
    {/each}

    <li>
        <form on:submit|preventDefault={addNewRelay} class="mt-3 flex rounded-md shadow-sm">
            <div class="relative flex flex-grow items-stretch focus-within:z-10">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                        class="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </div>
                <input
                    type="newRelay"
                    name="newRelay"
                    id="newRelay"
                    class="block w-full rounded-none rounded-l-md border-gray-300 pl-10 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="wss://..."
                />
            </div>
            <button
                type="submit"
                class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-purple-700 bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
                <span>Add</span>
            </button>
        </form>
    </li>
</ul>
