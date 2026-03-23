const ANTHROPIC_KEY = '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';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const d = await r.json();
    return res.status(200).json(d);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
