const Router = require('koa-router');
const db = require('./db');

const router = new Router();

// Get all data
router.get('/', async ctx => {
  const { rows } = await db.query(`
    SELECT
      country,
      country_code,
      province,
      province_abbr,
      lat,
      long,
      confirmed,
      recovered,
      deaths,
      last_update
    FROM covid_data
    ORDER BY confirmed ASC`);
    
  ctx.body = rows;
});

// Get global totals
router.get('/totals', async ctx => {
  const { rows } = await db.query(`
    SELECT
      SUM(confirmed)::INTEGER AS total_confirmed,
      SUM(recovered)::INTEGER AS total_recovered,
      SUM(deaths)::INTEGER AS total_deaths
    FROM covid_data
  `);
  
  ctx.body = rows[0];
});

// Get totals aggregated by country
router.get('/totals/country', async ctx => {
  const { rows } = await db.query(`
    SELECT
      country,
      country_code,
      SUM(confirmed)::INTEGER AS total_confirmed,
      SUM(recovered)::INTEGER AS total_recovered,
      SUM(deaths)::INTEGER AS total_deaths
    FROM covid_data
    GROUP BY country_code, country
    ORDER BY total_confirmed DESC
  `);
  
  ctx.body = rows;
});

// Get data by country code
router.get('/country/:countryCode', async ctx => {
  const countryCode = (ctx.params.countryCode || '').toUpperCase();
  ctx.assert(countryCode, 400, 'Country code must be provided');
  ctx.assert(countryCode.length === 2, 400, 'Country code must be 2 characters in length');
  
  const { rows } = await db.query(`
    SELECT
      country,
      country_code,
      province,
      province_abbr,
      lat,
      long,
      confirmed,
      recovered,
      deaths,
      last_update
    FROM covid_data
    WHERE country_code=$1
    ORDER BY confirmed DESC
  `, [countryCode]);
  
  ctx.body = rows;
});

// Get data for US state by state abbreviation
router.get('/country/us/:stateAbbr', async ctx => {
  const stateAbbr = (ctx.params.stateAbbr || '').toUpperCase();
  ctx.assert(stateAbbr, 400, 'State abbreviation must be provided');
  ctx.assert(stateAbbr.length === 2, 400, 'State abbreviation must be 2 characters in length');
  
  const { rows } = await db.query(`
    SELECT
      country,
      country_code,
      province,
      province_abbr,
      lat,
      long,
      confirmed,
      recovered,
      deaths,
      last_update
    FROM covid_data
    WHERE country_code='US' AND province_abbr=$1
    ORDER BY confirmed DESC
  `, [stateAbbr]);
  
  ctx.body = rows[0];
});

module.exports = router;
