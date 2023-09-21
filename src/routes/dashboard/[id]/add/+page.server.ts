import type { Actions } from './$types';
import { openAi } from '$lib/openai';

export const actions = {
  default: async ({ request, params, locals: { db, supabase } }) => {
    const form = await request.formData();
    const content = form.get('content')?.toString() ?? '';

    const embeds = await openAi.embeddings.create({
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
