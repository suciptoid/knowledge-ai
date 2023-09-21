<script lang="ts">
  import type { ActionData, PageServerData } from './$types';

  export let data: PageServerData;
  export let form: ActionData;
</script>

<h2 class="mb-4 font-medium">Knowledge</h2>

<div id="website-lists" class="gap-4 rounded-md bg-white p-8">
  Document count: {data.count}

  <form action="" method="post">
    <fieldset class="flex items-center gap-2">
      <input
        type="text"
        name="prompt"
        id="prompt"
        class="flex-1 rounded-md border px-3 py-2"
        placeholder="Ask your knowledgebase here..."
      />
      <button class="rounded-md bg-green-500 px-6 py-2 text-white">Ask</button>
    </fieldset>
  </form>
</div>
