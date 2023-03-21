<script>
    import { loggedUser } from '$lib/store';
    import { onMount } from 'svelte';
    import { Popover, PopoverButton, PopoverPanel, Transition } from '@rgossiaux/svelte-headlessui';
    import Avatar from './Avatar.svelte';
    import RelayMenu from '$lib/components/RelayMenu.svelte';
    import { goto } from '$app/navigation';

    const popoverClasses =
        'absolute right-0 top-10 bg-white text-black dark:bg-gray-700 dark:text-gray-200 shadow-lg rounded-lg w-96 z-10 flex flex-col p-4 sm:p-6 text-sm sm:text-base leading-7';

    let loggedIn;

    $: loggedIn = !!$loggedUser;

    onMount(async () => {
        const pubkey = localStorage.getItem('loggedUserPubkey');

        if (pubkey) {
            loggedUser.set(pubkey);
        }
    });

    export async function login() {
        const publicKey = await window.nostr.getPublicKey();
        loggedUser.set(publicKey);
        localStorage.setItem('loggedUserPubkey', publicKey);
    }

    export function logout() {
        loggedUser.set(null);
        localStorage.removeItem('loggedUserPubkey');
        goto('/');
    }
</script>

<nav class="ml-auto flex flex-row gap-4 font-medium items-center">
    <!-- <div style="position: relative;">
        <a
            href="/e/new"
            alt="Create a listing"
            class="px-2 py-1.5
            text-indigo-700 hover:text-white
            hover:bg-indigo-400 dark:hover:bg-indigo-700/40
            border border-indigo-700 dark:border-indigo-700
            dark:text-gray-200 dark:hover:text-white rounded-lg"
        >
            Create a listing
        </a>
    </div> -->
    <Popover style="position: relative;">
        <PopoverButton
            class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-50/20 rounded-lg"
            >Relays</PopoverButton
        >
        <Transition
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <PopoverPanel class={popoverClasses}>
                <RelayMenu />
            </PopoverPanel>
        </Transition>
    </Popover>
    <Popover style="position: relative;">
        <PopoverButton
            class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-50/20 rounded-lg"
            >About</PopoverButton
        >
        <Transition
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <PopoverPanel class={popoverClasses}>
                <h1 class="font-bold text-base sm:text-lg mb-3">Nostr-powered, Bitcoin-synced</h1>

                <p class="mb-4">ZapAuction is a Nostr-powered auction site.</p>
                <ul class="list-inside ml-4">
                    <li class="mb-2 font-medium">⚡ Buy and sell with Zaps</li>
                    <li class="mb-2 font-medium">
                        ⏳ Auctions close when Bitcoin prints a new block
                    </li>
                </ul>
                <p class="font-bold text-base sm:text-lg mt-6 font-mono">🧡 Pura Vida!</p>
            </PopoverPanel>
        </Transition>
    </Popover>
    {#if loggedIn}
        <Popover style="position: relative;" class="flex flex-row items-center">
            <PopoverButton>
                <Avatar pubkey={$loggedUser} klass="h-8 w-8" />
            </PopoverButton>
            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <PopoverPanel class="{popoverClasses} p-2 sm:p-2">
                    <!-- <a
                        href="/profile"
                        class="px-2 py-1 hover:bg-yellow-700/20 hover:dark:bg-yellow-400/20 rounded-lg"
                        >Profile</a
                    > -->
                    <a
                        href="#"
                        class="px-2 py-1 hover:bg-yellow-700/20 hover:dark:bg-yellow-400/20 rounded-lg"
                        on:click|preventDefault={logout}
                    >
                        Log Out
                    </a>
                </PopoverPanel>
            </Transition>
        </Popover>
    {:else}
        <a
            href="#"
            class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 rounded-lg"
            on:click|preventDefault={login}
        >
            Log in
        </a>
    {/if}
</nav>
