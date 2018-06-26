'use strict';
const path = require('path');
const fs = require('fs');
const SwaggerVersion = '2.0';

const DefinitionReader = require('./definition_reader');

module.exports = app => {

  let swagger = {};
  swagger.swagger = SwaggerVersion;
  swagger.host = '';
  swagger.basePath = '/';
  swagger.info = app.config.swaggerdoc.apiInfo;
  swagger.schemes = app.config.swaggerdoc.schemes;

  let tags = [];
  let paths = {};
  const scannerDir = path.join(app.config.baseDir, app.config.swaggerdoc.dirScanner);

  const names = fs.readdirSync(scannerDir);
  for (let name of names) {

    const filepath = path.join(scannerDir, name);
    const stat = fs.statSync(filepath);

    if (stat.isFile() && path.extname(name) === '.js') {

      let buffer = fs.readFileSync(filepath);
      let fileString = buffer.toString();

      const block_regex = /\/\*\*([\s\S]*?)\*\//gm;
      let blocks = fileString.match(block_regex);
      if (blocks[0].indexOf('Controller') < 0) break;
      let tagName = '';
      // Generate tags
      let router_path = {};
      for (let i = 0; i < blocks.length; i++) {
        let router_method = {};
        if (i === 0) {
          let controller = get_comments(blocks[i], /@Controller.*\n/gm)[0];
          tagName = controller[1] ? controller[1] : name.split('.js')[0];
          tags.push({
            name: tagName,
            description: controller[2] ? controller[2] : '',
          });
        } else {
          router_method.tags = [tagName];
          router_method.operationId = `${name.split('.')[0]}-${i}`;
          router_method.consumes = app.config.swaggerdoc.consumes;
          router_method.produces = app.config.swaggerdoc.produces;
          router_method.parameters = [];
          router_method.responses = {};
          router_method.description = 'description';
          router_method.summary = 'summary';

          let requests = get_comments(blocks[i], /@Request.*\n/gm);
          if (requests) {
            for (let request of requests) {
              let parameter = {};
              parameter.in = request[1];
              if (request[1].toLowerCase() !== 'body') {
                parameter.type = request[2];
              } else {

                let schema = {};
                if (!request[2].startsWith('array')) {
                  schema.$ref = `#/definitions/${request[2]}`;
                } else {
                  schema.type = 'array';
                  let ObjectType = ['boolean', 'integer', 'number', 'string'];
                  let items = {};
                  if (ObjectType.includes(request[2].substring(6, request[2].length - 1))) {
                    items.type = request[2].substring(6, request[2].length - 1);
                  } else {
                    items.$ref = `#/definitions/${request[2].substring(6, request[2].length - 1)}`;
                  }
                  schema.items = items;
                }
                parameter.schema = schema;
              }
              parameter.name = request[3].trim('*');
              parameter.required = false;
              if (request[3].indexOf('*') > -1) {
                parameter.required = true;
              }
              parameter.description = request[4] ? request[4] : '';
              router_method.parameters.push(parameter);
            }
          }

          let responses = get_comments(blocks[i], /@Response.*\n/gm) ? get_comments(blocks[i], /@Response.*\n/gm) : false;
          if (responses) {
            for (let response of responses) {
              let params = {};
              let schema = {};
              schema.$ref = `#/definitions/${response[2]}`;
              params.schema = schema;
              params.description = response[3] ? response[3] : '';
              router_method.responses[response[1]] = params;
            }
          }

          let router = get_comments(blocks[i], /@Router.*\n/gm) ? get_comments(blocks[i], /@Router.*\n/gm)[0] : false;
          if (router) {
            router_path[router[1].toLowerCase()] = router_method;
            paths[router[2]] = router_path;
          }
        }
      }

    }
    swagger.tags = tags;
    swagger.paths = paths;
    swagger.definitions = DefinitionReader(app);


    return swagger;
  }

  function get_comments(comments, regex) {
    let result = [];
    let comment_lines = comments.match(regex);
    if (comment_lines) {
      for (let comment_line of comment_lines) {
        result.push(comment_line.slice(1, comment_line.length - 1).split(' '));
      }
      return result;
    }
    return false;
  }
};
