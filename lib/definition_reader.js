'use strict';
const fs = require('fs');
const path = require('path');
const { type, item_type } = require('./type_support');


/**
 * 扫描app/contract中的文件，构建swaggerjson中的definitions
 * @param {*} app egg application
 * @return {Object} swagger definitions
 */
module.exports = app => {
  let definitions = {};

  let baseDir = path.join(app.config.baseDir, 'app');

  definition_reader(app, baseDir, 'contract');

  function definition_reader(app, baseDir, directory) {
    const requestDir = path.join(baseDir, directory);
    const index = requestDir.indexOf('contract');
    let objectRoute = requestDir.substring(index - 5, requestDir.length);
    const names = fs.readdirSync(requestDir);
    for (let name of names) {

      const filepath = path.join(requestDir, name);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        definition_reader(app, requestDir, name);
        continue;
      }

      if (stat.isFile() && path.extname(filepath) === '.js') {
        let def = require(filepath.split('.js')[0]);

        for (let object in def) {
          if (def[object].hasOwnProperty('type')) {
            // 兼容之前的版本
            definitions[object] = def[object];

          } else {
            let definition = {
              type: 'object',
              required: [],
              properties: {},
            };

            Object.keys(def[object]).forEach(field => {
              let err_prefix = `[egg-swagger-doc] in ${objectRoute + '/' + name} ${object} => ${field}`;
              if (def[object][field].hasOwnProperty('required') && def[object][field].required) {
                definition.required.push(field);
                delete def[object][field].required;
              }

              if (!def[object][field].hasOwnProperty('type')) {
                throw new Error(`${err_prefix} => type is necessary`);
              }

              if (!type.includes(def[object][field].type)) {
                def[object][field]['$ref'] = `#/definitions/${def[object][field].type}`;
                delete def[object][field].type;
              }
              // #region 对array数组的处理
              if (def[object][field].type === 'array') {
                if (!def[object][field].hasOwnProperty('itemType')) {
                  throw new Error(`${err_prefix} => itemType is necessary`);
                }

                if (!item_type.includes(def[object][field].itemType)) {
                  let itemType = { $ref: `#/definitions/${def[object][field].itemType}` };
                  def[object][field]['items'] = itemType;
                } else {
                  let itemType = { type: def[object][field].itemType };
                  def[object][field]['items'] = itemType;
                }
                delete def[object][field].itemType;
              }
              // #endregion
            });

            definition.properties = def[object];
            definitions[object] = definition;
          }
        }
      }
    }
  }
  return definitions;
};
