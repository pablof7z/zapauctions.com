<script>
    import { nostrPool, profiles } from '$lib/store';
    import { onMount } from 'svelte';

    onMount(() => {
        if (!$profiles[pubkey]) {
            $nostrPool.reqProfile(pubkey);
        }
    });

    export let pubkey;
    export let klass;

    let picture;

    $: picture =
        $profiles[pubkey]?.picture || `https://robohash.org/${pubkey?.slice(0, 1)}.png?set=set1`;
</script>

<img class="{klass} ring-4 dark:ring-gray-700 ring-yellow-700 rounded-full" src={picture} alt="" />
