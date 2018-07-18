'use strict';
const swaggerLoader = require('./lib/swagger_loader');
const swaggerRule = require('./lib/swagger_rule');

// load all js files in app/apis/ directory automatically
module.exports = app => {

  app.beforeStart(async () => {
    let swagger = swaggerLoader(app);
    app['swagger'] = swagger;
    app['rule'] = swaggerRule(app.swagger.definitions);
  });

};
