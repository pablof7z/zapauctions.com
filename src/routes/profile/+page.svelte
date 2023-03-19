<script>
    import { nostrPool, loggedUser, profiles } from '$lib/store';
    import Avatar from '$lib/components/Avatar.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        if ($loggedUser === undefined) {
            goto('/');
        }
    });
</script>

<div class="flex flex-row gap-6 items-center">
    <Avatar pubkey={$loggedUser} klass="w-12 h-12" />
    <div class="profileData flex flex-col gap-1">
        {#if $profiles[$loggedUser]}
            <h1>{$profiles[$loggedUser]?.display_name}</h1>
            <p>{$profiles[$loggedUser]?.nip05}</p>
        {/if}
    </div>
</div>
