'use strict';

const RULE = Symbol('Context#rule');
const swaggerRule = require('../../lib/swagger_rule');
module.exports = {
  get rule() {
    if (!this[RULE]) {

      this[RULE] = swaggerRule(this.app.swagger.definitions);
    }
    return this[RULE];
  },
};
