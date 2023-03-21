<script>
    import RelayMenu from '$lib/components/RelayMenu.svelte';
    import { Popover, PopoverButton, PopoverPanel, Transition } from '@rgossiaux/svelte-headlessui';

    const popoverClasses =
        'absolute left-12 bottom-12 bg-white text-black dark:bg-gray-700 dark:text-gray-200 shadow-lg rounded-lg w-96 z-10 flex flex-col p-4 sm:p-6 text-sm sm:text-base leading-7';
</script>

<Popover style="position: relative;">
    <PopoverButton class="text-4xl">⚙️</PopoverButton>
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
