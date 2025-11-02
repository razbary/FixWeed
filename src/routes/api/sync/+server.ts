import { json } from '@sveltejs/kit';
import { kv } from '@vercel/kv';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, data } = await request.json();
    
    if (!username || !data) {
      return json({ error: 'Missing username or data' }, { status: 400 });
    }
    
    await kv.set(`fixweed:${username}`, data);
    
    return json({ success: true });
  } catch (err) {
    console.error('Sync error:', err);
    return json({ error: 'Sync failed' }, { status: 500 });
  }
};

