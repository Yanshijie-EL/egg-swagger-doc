'use strict';

const path = require('path');
/**
 * egg-swagger default config
 * @member Config#swagger
 * @property {String} SOME_KEY - some description
 */
exports.swaggerdoc = {
  dirScanner: './app/controller',
  apiInfo: {
    title: 'egg-swagger',
    description: 'swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  enable: true,
};

exports.static = {
  prefix: '/',
  dir: path.join(__dirname, '../app/public'),
  // support lazy load
  dynamic: true,
  preload: false,
  buffer: false,
  maxFiles: 1000,
};
