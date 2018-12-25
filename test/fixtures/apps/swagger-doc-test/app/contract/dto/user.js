'use strict';

exports.User = {
  id: { type: 'integer', required: true },
  name: { type: 'string' },
  gender: { type: 'string', enum: ['1', '2'] },
};
