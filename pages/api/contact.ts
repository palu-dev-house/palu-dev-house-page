import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as ContactPayload;
  if (!body?.name || !body?.email) {
    return res.status(400).json({ error: 'Nama dan email wajib diisi' });
  }

  console.log('[contact]', {
    ts: new Date().toISOString(),
    ...body,
  });

  return res.status(200).json({ ok: true });
}
