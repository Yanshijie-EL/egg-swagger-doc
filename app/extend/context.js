'use strict';

const RULE = Symbol('Context#rule');
module.exports = {
  get rule() {
    if (!this[RULE]) {

      this[RULE] = this.app.rule;
      console.log(this.app.rule);
    }
    return this[RULE];
  },
};
