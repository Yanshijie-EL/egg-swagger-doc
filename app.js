'use strict';
const assert = require('assert');
const swagger_loader = require('./lib/swagger_loader');

// load all js files in app/apis/ directory automatically
module.exports = app => {

  app.beforeStart(async () => {
    app.swagger_documents = swagger_loader(app);
  });

  // remove existed swagger plugin configuration to prevent error configurations.
  const index = app.config.appMiddleware.indexOf('swagger');
  assert.equal(index, -1, 'Duplication of middleware name found: rest. Rename your middleware other than "rest" please.');
  // put swagger middleware in the first place
  app.config.coreMiddleware.unshift('swagger');

  app.logger.info('[egg-swagger-doc] register router: /swagger-ui.html');
  app.logger.info('[egg-swagger-doc] register router: /swagger-doc');
};
