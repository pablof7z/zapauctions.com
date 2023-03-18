<script>
    import TimeAgo from 'javascript-time-ago';
    import en from 'javascript-time-ago/locale/en';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import '../app.css';

    TimeAgo.addDefaultLocale(en);
</script>

<div class="wrapper">
    <div
        class="flex flex-col bg-gray-50 text-gray-600 dark:text-gray-200 dark:bg-gray-900 min-h-screen font-sans antialiased"
    >
        <div class="flex flex-col w-full">
            <Header />
            <slot />
            <Footer />
        </div>
    </div>
</div>
