'use strict';
const assert = require('assert');
// const definitions = require('./lib/definition_reader');

// load all js files in app/apis/ directory automatically
module.exports = app => {
  // remove existed swagger plugin configuration to prevent error configurations.
  const index = app.config.appMiddleware.indexOf('swagger');
  assert.equal(index, -1, 'Duplication of middleware name found: rest. Rename your middleware other than "rest" please.');
  // put swagger middleware in the first place
  app.config.coreMiddleware.unshift('swagger');
  
  app.logger.info(`[egg-swagger-doc] register router: '/swagger-ui.html'`);
  app.logger.info(`[egg-swagger-doc] register router: '/swagger-doc'`);
};
