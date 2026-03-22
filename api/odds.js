const ODDS_API_KEY = 'f351fb9eb3f3577c5fad8dff2b0ee907';
const KALSHI_KEY   = 'b438626c-a137-497b-a768-8dcd5c31a0a5';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url || '';

  try {

    if (path.includes('kalshi')) {
      const r = await fetch(
        'https://api.kalshi.com/trade-api/v2/markets?status=open&limit=200',
        { headers: { 'Authorization': `Bearer ${KALSHI_KEY}`, 'Content-Type': 'application/json' } }
      );
      const d = await r.json();
      const markets = d.markets || [];
      const ncaab = markets.filter(m => {
        const t = (m.title || m.subtitle || m.series_ticker || '').toLowerCase();
        return t.includes('ncaa') || t.includes('march madness') || t.includes('ncaab') || t.includes('college basketball') || (m.category||'').toLowerCase().includes('basketball');
      });
      return res.status(200).json({ markets: ncaab, total: markets.length });
    }

    if (path.includes('futures')) {
      const r = await fetch(
        `https://api.the-odds-api.com/v4/sports/basketball_ncaab_championship_winner/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=outrights&oddsFormat=american&bookmakers=draftkings,fanduel,betmgm,caesars`
      );
      const d = await r.json();
      return res.status(200).json(d);
    }

    const books = [
      'draftkings','fanduel','betmgm','caesars','betrivers',
      'pinnacle','bet365','unibet','williamhill_us','betonlineag'
    ].join(',');

    const r = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=${ODDS_API_KEY}&regions=us,eu,uk&markets=h2h,spreads&bookmakers=${books}&oddsFormat=american`
    );
    const d = await r.json();
    return res.status(200).json(d);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
