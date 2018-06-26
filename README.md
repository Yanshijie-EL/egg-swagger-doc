# egg-swagger-doc

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-swagger-doc.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-swagger-doc
[travis-image]: https://img.shields.io/travis/eggjs/egg-swagger-doc.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-swagger-doc
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-swagger-doc.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-swagger-doc?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-swagger-doc.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-swagger-doc
[snyk-image]: https://snyk.io/test/npm/egg-swagger-doc/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-swagger-doc
[download-image]: https://img.shields.io/npm/dm/egg-swagger-doc.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-swagger-doc

目前仅是测试

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
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
