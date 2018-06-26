'use strict';

module.exports = {
  createUser: {
    type: 'object',
    properties: {
      userName: {
        $ref: '#/definitions/updateUser',
      },
      password: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
  updateUser: {
    required: ['userName', 'password'],
    type: 'object',
    properties: {
      userName: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
};
