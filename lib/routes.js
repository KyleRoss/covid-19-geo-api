const Router = require('koa-router');
const schema = require('./querySchema');
const db = require('./db');

const cache = require('./middleware/cache');

const router = new Router();

// Redirect to Github
router.get('/', async ctx => {
  ctx.redirect('https://github.com/KyleRoss/covid-19-geo-api');
});

// Get all data
router.get('/data', cache(), async ctx => {
  const opts = await schema.tailor('data').validateAsync({
    country: ctx.query.country,
    state: ctx.query.state,
    order: ctx.query.order,
    dir: ctx.query.dir
  });
  
  const query = db.select().from('all_data').orderBy(opts.order, opts.dir);
  
  if(opts.country) query.where('country_code', opts.country);
  if(opts.state) query.where('province_abbr', opts.state);
  
  const rows = await query;
  ctx.body = opts.state? rows[0] : rows;
});

// Get global totals
router.get('/totals', cache(), async ctx => {
  const [row] = await db.select().from('totals');
  ctx.body = row;
});

// Get totals aggregated by country
router.get('/totals/country', cache(), async ctx => {
  const opts = await schema.tailor('totals').validateAsync({
    country: ctx.query.country,
    order: ctx.query.order,
    dir: ctx.query.dir
  });
  
  const query = db.select().from('country_totals').orderBy(opts.order, opts.dir);
  
  if(opts.country) query.where('country_code', opts.country);
  
  const rows = await query;
  ctx.body = opts.country? rows[0] : rows;
});

// Health route
router.get('/health', async ctx => {
  ctx.status = 204;
});

module.exports = router;
