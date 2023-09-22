import type { Actions } from './$types';
import { openai } from '$lib/server/openai';

export const actions = {
  default: async ({ request, params, locals: { db } }) => {
    const form = await request.formData();
    const content = form.get('content')?.toString() ?? '';

    const embeds = await openai.embeddings.create({
      input: content,
      model: 'text-embedding-ada-002'
    });

    const [{ embedding }] = embeds.data;

    console.log('embed response', embeds);

    const response = await db.from('documents').insert({
      content,
      embedding,
      knowledge_id: params.id
    });
    console.log('response', response);
  }
} satisfies Actions;
