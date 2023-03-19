<script>
    import UserRanking from '$lib/components/UserRanking.svelte';
    import NavBar from '$lib/components/NavBar.svelte';

    import RadioButton from '$lib/components/RadioButton.svelte';

    import Hero from '$lib/components/Hero.svelte';
    import ZapFeed from '$lib/components/ZapFeed.svelte';
    import NoteRanking from '$lib/components/NoteRanking.svelte';

    let mode = 'zap-feed';
    let sortMode = 'amount';

    function changeMode(newMode) {
        mode = newMode;
    }

    function changeSortMode(newSortMode) {
        sortMode = newSortMode;
    }
</script>

<svelte:head>
    <title>ZapAuction</title>
</svelte:head>

<!-- This is where the list of aution items will go -->
