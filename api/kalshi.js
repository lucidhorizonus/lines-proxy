const KALSHI_KEY = 'b438626c-a137-497b-a768-8dcd5c31a0a5';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(
      'https://api.kalshi.com/trade-api/v2/markets?status=open&limit=200',
      { headers: { 'Authorization': `Bearer ${KALSHI_KEY}`, 'Content-Type': 'application/json' } }
    );
    const d = await r.json();
    const markets = (d.markets || []).filter(m => {
      const t = (m.title || m.subtitle || m.series_ticker || '').toLowerCase();
      return t.includes('ncaa') || t.includes('march madness') || t.includes('ncaab') || t.includes('college basketball') || (m.category||'').toLowerCase().includes('basketball');
    });
    return res.status(200).json({ markets, total: (d.markets||[]).length });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
