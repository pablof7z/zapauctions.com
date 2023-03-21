<script>
    import RelayGear from '$lib/components/RelayGear.svelte';
</script>

<footer
    class="fixed flex justify-between items-center flex-row py-2 px-4 bg-gray-50/90 dark:bg-gray-900/90 font-mono text-gray-50 w-full text-center mt-12 left-0 bottom-0"
>
    <RelayGear />
    <div class="flex flex-row">
        <div class="text-sm">
            🍍 ZapAuction by
            <a class="text-purple-50 hover:text-purple-400" href="https://pablof7z.com">
                @pablof7z
            </a>
            &
            <a
                class="text-purple-50 hover:text-purple-400"
                href="nostr:npub1zuuajd7u3sx8xu92yav9jwxpr839cs0kc3q6t56vd5u9q033xmhsk6c2uc"
            >
                @erskingardner
            </a>
        </div>
    </div>
</footer>
