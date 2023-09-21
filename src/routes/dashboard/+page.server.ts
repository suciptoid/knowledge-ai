import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession, db } }) => {
  const session = await getSession();
  if (session?.user.id == null) {
    throw redirect(302, '/auth/login');
  }

  const query = await db.from('knowledges').select('*').eq('user_id', session.user.id);

  const knowledges = query.data;

  return { session, knowledges };
}) satisfies PageServerLoad;
