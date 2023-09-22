import OpenAI from 'openai';
import type { RequestHandler } from './$types';
import { encode } from 'gpt-tokenizer/esm/model/gpt-3.5-turbo';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, params, locals: { db } }) => {
  const form = await request.json();
  const content = form.prompt;

  const openai = new OpenAI({ apiKey: env.OPENAI_KEY });

  const embeds = await openai.embeddings.create({
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

  const maxToken = 1500;
  let tokenCount = 0;
  let contextText = '';

  console.log('documents count', documents?.length);

  if (documents) {
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const encoded = encode(doc.content);
      console.log('doc id', doc.id, 'token length:', encoded.length);
      tokenCount += encoded.length;

      if (tokenCount > maxToken) {
        break;
      }

      contextText += `${doc.content.trim()}\n---\n`;
    }
  }

  console.log('context', contextText);
  console.log('----\n\n');

  let prompt = `You are a very enthusiastic Assistant who loves to help people! Given the following sections from the personal knowledge base, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that".`;
  prompt += `

    Context sections: 
    ${contextText}

    Question: """
    ${content}
    """

    Answer as markdown (including related code snippets if available) and use same language as question language event if you dont know:
    `;

  const complete = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    max_tokens: 1500,
    temperature: 0,
    stream: true
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of complete) {
        const line = part.choices[0]?.text || '';
        controller.enqueue(line);
      }
      controller.close();
    },
    cancel() {
      console.log('abort stream');
      complete.controller.abort();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream'
    }
  });
};
