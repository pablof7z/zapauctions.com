<script>
    import MarkdownIt from 'markdown-it';
    import { massageString } from '$lib/utils';

    let md = new MarkdownIt();

    export let content;
    export let tags;
    let renderContent;

    $: renderContent = massageString(md.render(content).toString());
</script>

<div class="note-content text-black dark:text-white">
    {@html renderContent}
</div>
