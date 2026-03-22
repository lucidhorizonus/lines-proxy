const ODDS_API_KEY = 'f351fb9eb3f3577c5fad8dff2b0ee907';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_ncaab_championship_winner/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=outrights&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm,caesars`
    );
    const d = await r.json();
    return res.status(200).json(d);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
