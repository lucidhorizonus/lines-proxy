const ODDS_API_KEY = 'f351fb9eb3f3577c5fad8dff2b0ee907';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu,uk,au&markets=h2h,spreads&oddsFormat=american`
    );
    const d = await r.json();
    return res.status(200).json(d);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
