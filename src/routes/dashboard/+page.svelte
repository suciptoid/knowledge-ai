<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<h2 class="mb-4 font-medium">Knowledge</h2>

<div id="website-lists" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  {#if data.knowledges}
    {#each data.knowledges as knowledge}
      <a
        href={`/dashboard/${knowledge.id}`}
        class="flex flex-col items-start rounded-md bg-white p-6 transition hover:border-gray-500/40 hover:bg-gray-400/10 dark:bg-gray-600/10 dark:hover:bg-gray-400/10"
      >
        <div class="font-medium">{knowledge.title}</div>
      </a>
    {/each}
  {/if}
  <a
    id="add-website"
    href="/dashboard/add"
    class="flex h-[90px] items-center justify-center rounded-md border border-dashed border-gray-500/20 bg-white p-6 text-center text-sm font-medium text-gray-600 transition hover:border-gray-500/40 hover:bg-gray-400/10 dark:bg-gray-600/10 dark:hover:bg-gray-400/10"
  >
    Add Knowledge</a
  >
</div>
