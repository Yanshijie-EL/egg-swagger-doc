'use strict';

const path = require('path');
const fs = require('fs');
const { type, itemType } = require('../constant/index');

/**
 * contract Objectr
 */
let CONTRACT;
let VALIDATERULE;
/**
 * 获取应用中的contract定义
 * @param {EggApplication} app
 */
function generateContract(app) {

  CONTRACT = {};
  let baseDir = path.join(app.config.baseDir, 'app/contract');

  if (!fs.existsSync(baseDir)) {
    app.logger.warn('[egg-swagger-doc] can not found contract in app`s directory');
  }

  contractLoader(app, baseDir, '');

}

/**
 * 递归获取定义的Contract
 * @param {EggApplication} app Egg应用
 * @param {String} baseDir 根目录
 * @param {String} directory 相对目录
 */
function contractLoader(app, baseDir, directory) {

  const contractDir = path.join(baseDir, directory);

  const names = fs.readdirSync(contractDir);
  for (let name of names) {

    const filepath = path.join(contractDir, name);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      contractLoader(app, contractDir, name);
      continue;
    }

    if (stat.isFile() && ['.js', '.ts'].indexOf(path.extname(filepath)) !== -1) {
      let def = require(filepath.split(/\.(js|ts)/)[0]);

      for (let object in def) {
        CONTRACT[object] = {
          path: `app${filepath.split('app')[1]}`,
          content: def[object],
        };
      }
    }
  }
}

/**
 * 构建definition
 * @param {object} source contract超集
 */
function buildDefinition(source) {
  let result = {};
  for (let object in source) {
    let target = {
      type: 'object',
      required: [],
      properties: {},
    };
    let def = source[object].content;
    let path = source[object].path;

    for (let field in def) {

      if (def[field].hasOwnProperty('required') && def[field].required) {
        target.required.push(field);
      }
      delete def[field].required;

      if (!def[field].hasOwnProperty('type')) {
        throw new Error(`[egg-swagger-doc] ${path}: ${object}.${field}.type is necessary`);
      }

      if (!type.includes(def[field].type)) {
        def[field]['$ref'] = `#/definitions/${def[field].type}`;
        delete def[field].type;
      }

      // #region 对array数组的处理
      if (def[field].type === 'array') {
        if (!def[field].hasOwnProperty('itemType')) {
          throw new Error(`[egg-swagger-doc] ${path}: ${object}.${field}.itemType is necessary`);
        }

        if (!itemType.includes(def[field].itemType)) {
          let itemType = { $ref: `#/definitions/${def[field].itemType}` };
          def[field]['items'] = itemType;
        } else {
          let itemType = { type: def[field].itemType };
          def[field]['items'] = itemType;
        }
        delete def[field].itemType;
      }

      // 移除swagger非必要的属性
      if (def[field].type !== 'string') {
        delete def[field].format;
      }

      if ((def[field].format !== 'date-time' && def[field].format !== 'date')) {
        delete def[field].format;
      }

      delete def[field].max;
      delete def[field].min;
      delete def[field].allowEmpty;
      delete def[field].test;
    }

    target.properties = def;
    result[object] = target;
  }
  return result;
}

/**
 * 生成验证规则
 * @param {Object} source
 */
function buildValidateRule(source) {
  VALIDATERULE = {};
  for (let object in source) {
    let def = source[object].content;
    for (let field in def) {
      if (!type.includes(def[field].type)) {
        def[field]['rule'] = def[def[field].type];
        def[field].type = 'object';
      }

      // #region 对array数组的处理
      if (def[field].type === 'array') {

        if (!itemType.includes(def[field].itemType)) {
          def[field]['rule'] = source[def[field].itemType].content;
          def[field]['itemType'] = 'object';
        } else {
          def[field]['rule'] = { type: def[field].itemType };
        }
      }

      if (def[field].hasOwnProperty('enum')) {
        delete def[field].type;
        def[field] = def[field].enum;
        delete def[field].enum;
      }
      if (def[field].hasOwnProperty('format') &&
        def[field].format === 'date-time' && def[field].format === 'date') {
        delete def[field].format;
      }
      delete def[field].description;
      delete def[field].example;
    }
    VALIDATERULE[object] = def;
  }
}

module.exports = {
  /**
   * 获取定义的request/response object
   * @param {EggApplication} app egg应用
   */
  getDefinitions: app => {
    if (!CONTRACT) {
      generateContract(app);
    }

    let source = JSON.parse(JSON.stringify(CONTRACT));
    let definitions = buildDefinition(source);
    return definitions;
  },

  getValidateRuler: app => {
    if (!CONTRACT) {
      generateContract(app);
    }
    if (!VALIDATERULE) {
      let source = CONTRACT;
      buildValidateRule(source);
    }
    return VALIDATERULE;
  },
};

