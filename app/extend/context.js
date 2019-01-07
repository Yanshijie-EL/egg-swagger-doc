'use strict';
const { getValidateRuler } = require('../../lib/contract/index');

const RULE = Symbol('Context#rule');
module.exports = {
  get rule() {
    if (!this[RULE]) {

      this[RULE] = getValidateRuler(this.app);

    }
    return this[RULE];
  },
};
