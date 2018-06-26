'use strict';
const fs = require('fs');
const path = require('path');
const swagger_loader = require('../../lib/swagger_loader');

module.exports = () => {
  return function swagger(ctx, next) {
    if (ctx.app.config.swaggerdoc.enable === true) {
      if (ctx.url === '/swagger-ui.html') {
        let swaggerPath = path.join(__dirname, '../public/index.html');
        ctx.response.status = 200;
        ctx.response.type = 'text/html';
        ctx.response.body = fs.readFileSync(swaggerPath).toString();
      }
      if (ctx.url === '/swagger-doc') {
        ctx.response.status = 200;
        ctx.response.type = 'text/html';
        let swagger = swagger_loader(ctx.app);
        swagger.host = ctx.host;
        ctx.response.body = JSON.stringify(swagger);
        return ctx;
      }
    }
    return next();
  };
};
