const KALSHI_KEY = 'b438626c-a137-497b-a768-8dcd5c31a0a5';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(
      'https://api.elections.kalshi.com/trade-api/v2/markets?status=open&limit=100&series_ticker=KXNCAAMBGAME',
      { headers: { 'Authorization': `Bearer ${KALSHI_KEY}`, 'Content-Type': 'application/json' } }
    );
    const d = await r.json();
    const raw = d.markets || [];

    // Group by event_ticker — each game has two markets (one per team)
    const events = {};
    for (const m of raw) {
      const ev = m.event_ticker;
      if (!events[ev]) events[ev] = [];
      events[ev].push({
        team: m.yes_sub_title || m.title,
        prob: ((parseFloat(m.yes_bid_dollars) || 0) + (parseFloat(m.yes_ask_dollars) || 0)) / 2,
        volume: parseFloat(m.volume_fp) || 0,
        title: m.title,
      });
    }

    // Convert to array of paired game objects
    const games = Object.entries(events).map(([ticker, teams]) => ({
      ticker,
      title: teams[0]?.title || ticker,
      teams,
      totalVolume: teams.reduce((s, t) => s + t.volume, 0),
    }));

    return res.status(200).json({ games, total: games.length });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
