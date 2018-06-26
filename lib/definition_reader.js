'use strict';
const fs = require('fs');
const path = require('path');

module.exports = app => {

  let definitions = {};

  let baseDir = path.join(app.config.baseDir, 'app');

  definition_reader(app, baseDir, 'contract');

  function definition_reader(app, baseDir, directory) {
    const requestDir = path.join(baseDir, directory);

    const names = fs.readdirSync(requestDir);
    for (let name of names) {

      const filepath = path.join(requestDir, name);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        definition_reader(app, requestDir, name);
        continue;
      }

      if (stat.isFile() && path.extname(filepath) === '.js') {
        let rules = require(filepath.split('.')[0]);
        // console.log(rules);
        for (let rule in rules) {
          definitions[rule] = rules[rule];
        }
      }
    }
  }

  return definitions;
};

