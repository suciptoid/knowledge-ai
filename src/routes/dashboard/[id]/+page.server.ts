import { openAi } from '$lib/openai';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params, locals: { db, getSession, supabase } }) => {
  const session = await getSession();
  const docs = await db
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('knowledge_id', params.id);

  return {
    count: docs.count
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ params, request, locals: { db } }) => {
    const form = await request.formData();
    const content = form.get('prompt')?.toString() ?? '';

    const embeds = await openAi.embeddings.create({
      input: content,
      model: 'text-embedding-ada-002'
    });

    const [{ embedding }] = embeds.data;

    const { data: documents, error } = await db.rpc('match_documents', {
      knowledge_id: params.id,
      query_embedding: embedding,
      match_threshold: 0.78, // Choose an appropriate threshold for your data
      match_count: 10 // Choose the number of matches
    });
    console.log('error', error);

    console.log('embed response', embeds, documents);
    return {
      embeds,
      documents
    };
  }
} satisfies Actions;
