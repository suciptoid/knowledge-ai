<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { navigating } from '$app/stores';
  import type { ActionData, PageServerData } from './$types';

  export let data: PageServerData;

  type History = {
    from: 'user' | 'bot';
    message: string;
    processing?: boolean;
  };

  let streams = '';
  let streaming = false;
  let prompt = '';
  let history: History[] = [
    {
      from: 'bot',
      message: `Hello I'm bot assistant to help you with your knowledge base, currently we have ${data.count} document.`
    }
  ];

  async function fetchStreams(e: SubmitEvent) {
    e.preventDefault();

    const userPrompt = prompt;

    prompt = '';

    if (!userPrompt) {
      return;
    }

    history = [
      ...history,
      {
        from: 'user',
        message: userPrompt
      }
    ];

    streaming = true;

    const req = await fetch(`/dashboard/${$page.params.id}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: userPrompt
      })
    });

    const reader = req.body?.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const line = await reader?.read();

      if (line?.done) {
        streaming = false;

        history = [
          ...history,
          {
            from: 'bot',
            message: streams
          }
        ];
        streams = '';
        break;
      }

      streams += line?.value;
    }
  }
</script>

<h2 class="mb-4 font-medium">Knowledge</h2>

<div id="website-lists" class="gap-4 rounded-md bg-white p-8">
  <div id="chat-box" class="flex flex-col gap-2 py-4">
    {#each history as h}
      <div
        class="history w-3/4 rounded-lg border px-3 py-2 text-sm {h.from == 'bot'
          ? ' bg-gray-50'
          : 'self-end'}"
      >
        <div class="text-md font-medium">{h.from}</div>
        <div class="whitespace-pre-wrap">{h.message}</div>
      </div>
    {/each}
    {#if streaming}
      <div
        class="history w-3/4 rounded-lg border bg-gray-50 px-3 py-2
           text-sm"
      >
        <div class="text-md font-medium">bot</div>
        <div>{streams?.length == 0 ? 'Thinking...' : streams}</div>
      </div>
    {/if}
  </div>

  <form action="" method="post" on:submit={fetchStreams}>
    <fieldset class="flex items-center gap-2">
      <input
        bind:value={prompt}
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
