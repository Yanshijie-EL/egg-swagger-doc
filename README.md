# egg-swagger-doc

针对eggjs的swaggerUI

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

例：
```js

```
---

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
