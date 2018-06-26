'use strict';
module.exports = {
  createResource: {
    required: ['workshopId', 'userName'],
    type: 'object',
    properties: {
      workshopId: {
        type: 'string',
      },
      userName: {
        type: 'string',
      },
      phoneNumber: {
        type: 'string',
      },
      unionId: {
        type: 'string',
      },
    },

  },
};
