<script>
    import { loggedUser } from '$lib/store';
    import { onMount } from 'svelte';
    import { Popover, PopoverButton, PopoverPanel, Transition } from '@rgossiaux/svelte-headlessui';
    import Avatar from './Avatar.svelte';

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
        console.log(publicKey);
    }

    export function logout() {
        loggedUser.set(null);
        localStorage.removeItem('loggedUserPubkey');
        console.log('Logged out');
    }
</script>

<div class="header p-8">
    <div class="logo flex flex-row gap-4 items-center text-yellow-700 dark:text-yellow-400">
        <a
            href="/"
            class="flex flex-row items-baseline gap-2 text-3xl"
            style="font-family: 'Press Start 2P';"
        >
            <img src="/images/pineapple-svgrepo-com.svg" alt="ZapAuction" class="w-10 h-10" />
            ZapAuction
        </a>
        <nav class="ml-auto flex flex-row gap-4 font-medium">
            <Popover style="position: relative;">
                <PopoverButton
                    class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 rounded-lg"
                    >Relays</PopoverButton
                >

                <PopoverPanel style="position: absolute; z-index: 10;">
                    <div class="panel-contents">
                        <a href="/analytics">Analytics</a>
                        <a href="/engagement">Engagement</a>
                        <a href="/security">Security</a>
                        <a href="/integrations">Integrations</a>
                    </div>

                    <img src="/solutions.jpg" alt="" />
                </PopoverPanel>
            </Popover>
            <Popover style="position: relative;">
                <PopoverButton
                    class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 rounded-lg"
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
                    <PopoverPanel
                        class="absolute right-0 top-10 bg-white text-black dark:bg-gray-700 dark:text-gray-200 shadow-lg rounded-lg w-96 z-10 flex flex-col p-8 leading-7"
                    >
                        <h1 class="font-bold text-lg mb-3">Nostr-powered, Bitcoin-synced</h1>

                        <p class="mb-4">ZapAuction is a Nostr-powered auction site.</p>
                        <ul class="list-inside ml-4">
                            <li class="mb-2 font-medium">⚡ Buy and sell with Zaps</li>
                            <li class="mb-2 font-medium">
                                ⏳ Auctions close when Bitcoin prints a new block
                            </li>
                        </ul>
                        <p class="font-bold text-xl mt-6 font-mono">🧡 Pura Vida!</p>
                    </PopoverPanel>
                </Transition>
            </Popover>
            {#if loggedIn}
                <Popover style="position: relative;">
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
                        <PopoverPanel
                            class="flex flex-col gap-2 absolute right-0 top-10 bg-white text-black dark:bg-gray-700 dark:text-gray-200 shadow-lg rounded-lg w-96 z-10 flex flex-col p-2 leading-7"
                        >
                            <a
                                href="#"
                                class="px-2 py-1 hover:bg-yellow-700/20 hover:dark:bg-yellow-400/20 rounded-lg"
                                >Profile</a
                            >
                            <a
                                href="#"
                                class="px-2 py-1 hover:bg-yellow-700/20 hover:dark:bg-yellow-400/20 rounded-lg"
                                on:click|preventDefault={logout}
                            >
                                Log out
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
    </div>
</div>
