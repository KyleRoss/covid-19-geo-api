const NodeCache = require('node-cache');
const cache = new NodeCache({
  stdTTL: 60 * 3 // 3 minutes
});

module.exports = function cacheMiddleware() {
  return async function responseCache(ctx, next) {
    const key = ctx.originalUrl;
    const data = cache.get(key);
    
    if(data) return ctx.body = data;
    await next();
    
    if(!ctx.body) return;
    cache.set(key, ctx.body);
  };
};
