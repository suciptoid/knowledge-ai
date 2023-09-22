import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals: { db } }) => {
  // const session = await getSession();
  const docs = await db
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('knowledge_id', params.id);

  return {
    document: docs.data,
    count: docs.count
  };
}) satisfies PageServerLoad;

// export const actions = {
//   default: async ({ params, request, locals: { db } }) => {
//     const form = await request.formData();
//     const content = form.get('prompt')?.toString() ?? '';

//     const embeds = await openAi.embeddings.create({
//       input: content,
//       model: 'text-embedding-ada-002'
//     });

//     const [{ embedding }] = embeds.data;

//     const { data: documents, error } = await db.rpc('match_documents', {
//       knowledge_id: params.id,
//       query_embedding: embedding,
//       match_threshold: 0.78, // Choose an appropriate threshold for your data
//       match_count: 10 // Choose the number of matches
//     });
//     console.log('error', error);

//     const maxToken = 1500;
//     let tokenCount = 0;
//     let contextText = '';

//     console.log('documents count', documents?.length);

//     if (documents) {
//       for (let i = 0; i < documents.length; i++) {
//         const doc = documents[i];
//         const encoded = encode(doc.content);
//         console.log('doc id', doc.id, 'token length:', encoded.length);
//         tokenCount += encoded.length;

//         if (tokenCount > maxToken) {
//           break;
//         }

//         contextText += `${doc.content.trim()}\n---\n`;
//       }
//     }

//     console.log('context', contextText);
//     console.log('----\n\n');

//     let prompt = `You are a very enthusiastic Assistant who loves to help people! Given the following sections from the personal knowledge base, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that".`;
//     prompt += `

//     Context sections:
//     ${contextText}

//     Question: """
//     ${content}
//     """

//     Answer as markdown (including related code snippets if available) and use same language as question language event if you dont know:
//     `;

//     const complete = await openAi.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       prompt,
//       max_tokens: 1500,
//       temperature: 0
//     });

//     const {
//       id,
//       choices: [{ text }],
//       usage
//     } = complete;

//     return {
//       text,
//       id
//     };
//   }
// } satisfies Actions;
