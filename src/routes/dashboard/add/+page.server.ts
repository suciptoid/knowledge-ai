import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, locals: { db, getSession } }) => {
    const form = await request.formData();
    const session = await getSession();

    const knowledge = await db
      .from('knowledges')
      .insert({
        title: form.get('title'),
        user_id: session?.user.id
      })
      .select('id');

    console.log('insert knowledge', knowledge);
    if (knowledge.error) {
      return fail(400, {
        message: 'Fail insert knowledge',
        error: knowledge.error
      });
    }

    if (knowledge.data?.[0]?.id) {
      throw redirect(302, `/dashboard/${knowledge.data?.[0]?.id}`);
    }
  }
} satisfies Actions;
