'use strict';
const { item_type } = require('./type_support');

module.exports = definitions => {

  let rules = {};
  for (let objectName in definitions) {

    for (let field of definitions[objectName].required) {
      definitions[objectName].properties[field]['required'] = true;
    }

    for (let field in definitions[objectName].properties) {
      delete definitions[objectName].properties[field].example;
      if (definitions[objectName].properties[field].hasOwnProperty('enum')) {
        definitions[objectName].properties[field].type = 'enum';
        definitions[objectName].properties[field]['values'] = definitions[objectName].properties[field].enum;
        delete definitions[objectName].properties[field].enum;
      }

      if (definitions[objectName].properties[field].hasOwnProperty('$ref')) {
        let typeStr = definitions[objectName].properties[field].$ref;
        let itemType = typeStr.substring(typeStr.lastIndexOf('/') + 1);
        definitions[objectName].properties[field].type = itemType;
        delete definitions[objectName].properties[field].$ref;
      }

      if (definitions[objectName].properties[field].type === 'array') {
        let itemType = definitions[objectName].properties[field].items.type;
        if (definitions[objectName].properties[field].items.hasOwnProperty('$ref')) {
          let typeStr = definitions[objectName].properties[field].items.$ref;
          itemType = typeStr.substring(typeStr.lastIndexOf('/') + 1);
        }

        definitions[objectName].properties[field]['itemType'] = itemType;
        delete definitions[objectName].properties[field].items;

      }
    }
    rules[objectName] = definitions[objectName].properties;
  }

  for (let objectName in rules) {
    for (let field in rules[objectName]) {
      if (!item_type.includes(rules[objectName][field].type)) {
        if (rules[objectName][field].type === 'enum') continue;
        rules[objectName][field]['rule'] = rules[rules[objectName][field].type];
        rules[objectName][field].type = 'object';
      }
      if (rules[objectName][field].type === 'array') {
        if (!item_type.includes(rules[objectName][field].itemType)) {
          rules[objectName][field]['rule'] = rules[rules[objectName][field].itemType];
          rules[objectName][field].itemType = 'object';
        }
      }
    }
  }
  return rules;
};
