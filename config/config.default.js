'use strict';

const path = require('path');
/**
 * egg-swagger-doc default config
 * @member Config#swagger-doc
 * @property {String} dirScanner - 插件扫描的文档路径
 * @property {String} basePath - api前置路由
 * @property {Object} apiInfo - 可参考Swagger文档中的Info
 * @property {Array[String]} apiInfo - 可参考Swagger文档中的Info
 * @property {Array[String]} schemes - 访问地址协议http或者https
 * @property {Array[String]} consumes - contentType的集合
 * @property {Array[String]} produces - contentType的集合
 * @property {Object} securityDefinitions - 安全验证，具体参考swagger官方文档
 * @property {Boolean} enableSecurity - 是否使用安全验证
 * @property {Boolean} enable - swagger-ui是否可以访问
 */
exports.swaggerdoc = {
  dirScanner: './app/controller',
  basePath: '/',
  apiInfo: {
    title: 'egg-swagger',
    description: 'swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    // apikey: {
    //   type: 'apiKey',
    //   name: 'clientkey',
    //   in: 'header',
    // },
    // oauth2: {
    //   type: 'oauth2',
    //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
    //   flow: 'password',
    //   scopes: {
    //     'write:access_token': 'write access_token',
    //     'read:access_token': 'read access_token',
    //   },
    // },
  },
  enableSecurity: false,
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
