<script>
    import { loggedUser } from '$lib/store';
    export async function login() {
        const publicKey = await window.nostr.getPublicKey();
        loggedUser.set(publicKey);
        localStorage.setItem('loggedUserPubkey', publicKey);
    }
</script>

<a
    href="#"
    class="px-2 py-1 border border-yellow-700 dark:border-yellow-400 rounded-lg"
    on:click|preventDefault={login}
>
    Log in
</a>
