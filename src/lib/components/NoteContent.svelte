<script>
    import MarkdownIt from 'markdown-it';
    import { massageString } from '$lib/utils';

    let md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
    });

    export let content;
    export let tags;
    let renderContent;

    $: renderContent = massageString(md.render(content).toString());
</script>

<div class="note-content text-black dark:text-white break-words">
    {@html renderContent}
</div>
