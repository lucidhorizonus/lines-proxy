const ODDS_API_KEY = 'f351fb9eb3f3577c5fad8dff2b0ee907';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url || '';
  const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
  const gameId = params.get('id');

  try {
    // Single game odds — only called on click
    if (gameId) {
      const r = await fetch(
        `https://api.the-odds-api.com/v4/sports/basketball_ncaab/events/${gameId}/odds?apiKey=${ODDS_API_KEY}&regions=us,eu,uk,au&markets=h2h,spreads&oddsFormat=american`
      );
      const d = await r.json();
      return res.status(200).json(d);
    }

    // Events list only — no odds, very cheap, used for page load
    const r = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_ncaab/events?apiKey=${ODDS_API_KEY}`
    );
    const d = await r.json();
    return res.status(200).json(d);

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
