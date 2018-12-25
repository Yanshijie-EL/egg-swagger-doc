'use strict';

const path = require('path');
const staticCache = require('koa-static-cache');
const { documentInit, getFuncBundler } = require('../document/index');
// const { getValidateRuler } = require('../contract/index');

module.exports = {

  /**
   * 注册SwaggerUI基础路由
   */
  basicRouterRegister: app => {

    // swaggerUI json字符串访问地址
    app.get('/swagger-doc', ctx => {
      ctx.response.status = 200;
      ctx.response.type = 'application/json';
      ctx.response.body = documentInit(app);
    });
    app.logger.info('[egg-swagger-doc] register router: get /swagger-doc');

    // swaggerUI的静态资源加入缓存，配置访问路由
    const swaggerH5 = path.join(__dirname, '../../app/public');
    app.use(staticCache(swaggerH5, {
      alias: {
        '/swagger-ui.html': '/index.html',
      },
    }, {}));
    app.logger.info('[egg-swagger-doc] register router: get /swagger-ui.html');

  },
  /**
   * 注册扫描到的路由
   */
  RouterRegister: app => {
    const funcBundler = getFuncBundler(app);
    // const rules = getValidateRuler(app);

    for (let obj of funcBundler) {
      let instance = require(obj.filePath);
      let controller = instance.prototype || instance;

      let direct = `${obj.filePath.split('.js')[0].split('app/')[1]}`;

      for (let router of obj.routers) {

        // if (app.config.swaggerdoc.enableValidate && router.ruleName) {

        //   app[router.method](router.route.replace('{', ':').replace('}', ''), function (ctx, next) {

        //     app.logger.info(`[egg-swagger-doc] validate ${router.ruleName}`);
        //     // app.logger.info(JSON.stringify(rules[router.ruleName]));
        //     return next();
        //   }, controller[router.func]);

        // } else {

        app[router.method](router.route.replace('{', ':').replace('}', ''), controller[router.func]);

        // }
        app.logger.info(`[egg-swagger-doc] register router: ${router.method} ${router.route} for ${direct.replace('/', '-')}-${router.func} `);
      }

    }
  },

};
