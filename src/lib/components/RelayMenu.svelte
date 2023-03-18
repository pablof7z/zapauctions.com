<script>
    import { nostrPool, relayEvents } from '$lib/store';

    let displayRelayInfo = false;

    async function addNewRelay(e) {
        const formData = new FormData(e.target);
        $nostrPool.add(formData.get('newRelay'));
        e.target.reset();
    }
</script>
