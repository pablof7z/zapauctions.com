<script>
    import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="header py-8">
    <div
        class="logo flex flex-row gap-4 justify-center md:justify-start items-center text-yellow-700 dark:text-yellow-400"
    >
        <a
            href="/"
            class="flex flex-row items-baseline gap-2 text-xl sm:text-3xl"
            style="font-family: 'Press Start 2P';"
        >
            <img
                src="/images/pineapple-svgrepo-com.svg"
                alt="ZapAuction"
                class="w-6 h-6 sm:w-10 sm:h-10"
            />
            ZapAuction
        </a>
        <div class="navBar hidden md:block ml-auto">
            <NavBar />
        </div>
    </div>
</div>
