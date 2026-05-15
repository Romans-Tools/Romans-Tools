const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'roman-toolbox';
const KEY = 'admin-state';

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  const store = getStore(STORE_NAME);

  if (event.httpMethod === 'GET') {
    const existing = await store.get(KEY, { type: 'json' });
    return json(200, existing || { statuses: {}, layout: {} });
  }

  if (event.httpMethod === 'PUT') {
    let payload;

    try {
      payload = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body.' });
    }

    const statuses = payload.statuses && typeof payload.statuses === 'object' ? payload.statuses : {};
    const layout = payload.layout && typeof payload.layout === 'object' ? payload.layout : {};

    await store.setJSON(KEY, { statuses, layout, updatedAt: new Date().toISOString() });
    return json(200, { ok: true });
  }

  return json(405, { error: 'Method not allowed.' });
};
