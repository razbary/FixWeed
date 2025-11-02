import { json } from '@sveltejs/kit';
import { kv } from '@vercel/kv';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { username } = params;
    
    if (!username) {
      return json({ error: 'Missing username' }, { status: 400 });
    }
    
    const data = await kv.get(`fixweed:${username}`);
    
    if (!data) {
      return json({ error: 'Not found' }, { status: 404 });
    }
    
    return json({ data });
  } catch (err) {
    console.error('Load error:', err);
    return json({ error: 'Load failed' }, { status: 500 });
  }
};

