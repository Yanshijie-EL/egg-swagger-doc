# egg-swagger-doc

应用于eggjs的plugin,可自动生成SwaggerUI。应用启动后访问/swaagger-ui.html可以浏览页面，访问/swagger-doc,获取swaggerjson.

## Install

```bash
$ npm i egg-swagger-doc --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.swaggerdoc = {
  enable: true,
  package: 'egg-swagger-doc',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
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
```

see [config/config.default.js](config/config.default.js) for more detail.

## Introduce
完成插件引入之后，如果不修改默认配置，应用启动后，会自动扫描app/controller和app/contract下的文件。controller下的文件先不做描述。contract下的文件为定义好的请求体和响应体。

@Controller
---
格式：@Controller {ControllerName}

    a.如果文件第一个注释块中存在标签@Controller，应用会扫描当前文件下的所有注释块，否则扫描将会跳过该文件。
    b.如果不标示ControllerName，程序会将当前文件的文件名作为ControllerName。
例：
```js
/**
 * @Controller user
 */
class UserController extends Controller {
  //some method
}
```
@Router
---
格式：@Router {Mothod} {Path}

    a.Mothod,请求的方法(post/get/put/delete等)，不区分大小写。
    b.Path,请求的路由。

@Request 
---
格式：@Request {Position} {Type} {Name} {Description}

    a.position.参数的位置,该值可以是body/path/query/header/formData.
    b.Type.参数类型，body之外位置目前只支持基础类型,integer/string/boolean/number，及基础类型构成的数组，body中则支持contract中定义的类型。
    c.Name.参数名称.如果参数名称以*开头则表示必要，否则非必要。
    d.Description.参数描述

@Response
---
格式：@Response {HttpStatus} {Type} {Description}

    a.HttpStatus.Http状态码。
    b.Type.同Request中body位置的参数类型。
    d.Description.响应描述。

@Deprecated
---

    如果注释块中包含此标识，则表示该注释块注明的接口，未完成或不启用。

@Description
---
格式：@Description {Description}

    接口具体描述

@Summary
---
格式：@Summary {Summary}

    接口信息小标题


例：
```js
/**
 * @Controller user
 */
class HomeController extends Controller {
  /**
   * @Router POST /user
   * @Request body createUser name description-createUser
   * @Request header string access_token
   * @Response 200 baseResponse ok
   */
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }
```
如果在config中开启并定义了securityDefinitions,默认enableSecurity为false.则可在注释块中加入@apikey，加入安全验证。也可定义成其他名字，只需@定义好的字段名就好。关于securityDefinitions的定义可以自行搜索。

```js
exports.swaggerdoc = {
  securityDefinitions: {
    apikey: {
      type: 'apiKey',
      name: 'clientkey',
      in: 'header',
    },
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
  enableSecurity: true,
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/Ysj291823/egg-swagger-doc/issues).

## License

[MIT](LICENSE)
