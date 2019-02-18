'use strict';

const path = require('path');
const staticCache = require('koa-static-cache');
const { documentInit, getFuncBundler } = require('../document/index');
const { convertControllerPath } = require('./util');

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
    app.use(staticCache(swaggerH5, {}, {}));
    app.logger.info('[egg-swagger-doc] register router: get /swagger-ui.html');

  },
  /**
   * 注册扫描到的路由
   */
  RouterRegister: app => {
    const funcBundler = getFuncBundler(app);
    // const rules = getValidateRuler(app);
    const { router, controller } = app;

    for (let obj of funcBundler) {
      let instance = require(obj.filePath);

      let fileExtname = path.extname(obj.filePath);
      let direct = `${obj.filePath.split(fileExtname)[0].split('app' + path.sep)[1]}`;

      if (fileExtname === '.ts') {
        instance = instance.default;
      }

      for (let req of obj.routers) {

        // if (app.config.swaggerdoc.enableValidate && router.ruleName) {

        //   app[router.method](router.route.replace('{', ':').replace('}', ''), function (ctx, next) {

        //     app.logger.info(`[egg-swagger-doc] validate ${router.ruleName}`);
        //     // app.logger.info(JSON.stringify(rules[router.ruleName]));
        //     return next();
        //   }, controller[router.func]);

        // } else {

        if (instance.prototype) {
          const control = convertControllerPath(instance.prototype.pathName, controller);
          router[req.method](req.route.replace('{', ':').replace('}', ''), control[req.func]);
        } else {
          router[req.method](req.route.replace('{', ':').replace('}', ''), instance[req.func]);
        }
        // }
        app.logger.info(`[egg-swagger-doc] register router: ${req.method} ${req.route} for ${direct.replace(path.sep, '-')}-${req.func} `);
      }

    }
  },

};
