module.exports = function errorHandlerMiddleware() {
  return async function errorHandler(ctx, next) {
    try {
      // Continue down the chain...
      await next();
      
      // Handle not found error
      if(ctx.response.status === 404) ctx.throw(404, 'Not found');
    } catch(e) {
      // Default status to 500 if provided status is not a number
      ctx.status = typeof e.status === 'number'? e.status : 500;
      if(e.name === 'ValidationError') ctx.status = 400;
      
      console.error(`Request failed with a ${ctx.status} code`);
      console.error(e);
      
      // Respond with error object
      ctx.body = {
        error: e.message,
        status: ctx.status
      };
    }
  };
};
