'use strict';
const { swaggerInit } = require('./lib/index');

module.exports = app => {

  app.beforeStart(async () => {

    swaggerInit(app);

  });

};
