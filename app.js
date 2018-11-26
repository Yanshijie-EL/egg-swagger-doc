'use strict';
const swaggerLoader = require('./lib/swagger_loader');
const swaggerRule = require('./lib/swagger_rule');
const path = require('path');
const fs = require('fs');

// load all js files in app/apis/ directory automatically
module.exports = app => {

  app.beforeStart(async () => {
    const swagger = swaggerLoader(app);

    if (app.config.swaggerdoc.enable) {
      app.get('/swagger-doc', ctx => {
        ctx.response.status = 200;
        ctx.response.type = 'text/html';
        swagger.host = ctx.host;
        ctx.response.body = JSON.stringify(swagger);

      });
      app.logger.info('[egg-swagger-doc] register router: /swagger-doc');

      app.get('/public/swagger-ui.html', ctx => {
        let swaggerPath = path.join(__dirname, '/app/public/index.html');
        ctx.response.status = 200;
        ctx.response.type = 'text/html';
        ctx.response.body = fs.readFileSync(swaggerPath).toString();
      });
      app.logger.info('[egg-swagger-doc] register router: /public/swagger-ui.html');
    }

    app['rule'] = swaggerRule(swagger.definitions);

  });

};
