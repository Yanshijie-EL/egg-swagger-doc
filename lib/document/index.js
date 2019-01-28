'use strict';
const path = require('path');
const fs = require('fs');

const contract = require('../contract/index');
const comment = require('../comment/index');
const _ = require('../constant/index');
/**
 * swagger Document
 */
let DOCUMENT;
let FUNCTIONBUNDLER = [];
/**
 * 构建Document
 * @controller {tagName} {description} 接受swaggerDoc扫描，并命名该controller名字，默认为文件名
 * @deprecated 未完成接口
 * @summary {content} 接口标题
 * @description {content} 接口描述
 * @router {method} {routerkey} 接口请求地址
 * @request {position} {type} {name} {description} 请求体
 * @response {http_status} {type} {description} 响应体
 * @consume {consume} 例 @consume application/json
 * @produce {produce} 例 @consume application/json
 * @ignore 实验性功能，自动生成路由时(需遵循一定规则)，跳过指定非 API function扫描
 */
function buildDocument(app) {
  // config
  let swagger = app.config.swaggerdoc;

  let securitys = [];
  let tag_path = {
    tags: [],
    paths: {},
  };

  // 允许使用验证
  if (swagger.enableSecurity) {
    // 获取定义的安全验证名称
    for (let security in swagger.securityDefinitions) {
      securitys.push(security);
    }
  }

  // 遍历contract,组装swagger.definitions
  let definitions = contract.getDefinitions(app);

  let filepath = path.join(app.config.baseDir, swagger.dirScanner);

  // 递归获取 tags&paths
  tag_path = getTag_Path(filepath, securitys, swagger, definitions);

  // build document
  DOCUMENT = {
    host: '',
    swagger: _.SWAGGERVERSION,
    basePath: swagger.basePath,
    info: swagger.apiInfo,
    schemes: swagger.schemes,
    tags: tag_path.tags,
    paths: tag_path.paths,
    securityDefinitions: swagger.securityDefinitions,
    definitions,
  };

  return DOCUMENT;
}

function getTag_Path(fileDir, securitys, swagger, definitions) {

  // 已存在tag集合
  let tagNames = [];
  let tags = [];
  let paths = {};

  const names = fs.readdirSync(fileDir);
  for (let name of names) {

    const filepath = path.join(fileDir, name);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      const subPath = getTag_Path(filepath, securitys, swagger, definitions);
      // 合并子目录的扫描结果
      tags.concat(subPath.tags);
      Object.assign(paths, subPath.paths);
      continue;
    }

    if (stat.isFile() && ['.js', '.ts'].indexOf(path.extname(name)) !== -1) {

      let blocks = comment.generateCommentBlocks(filepath);

      // 如果第一个注释块不包含@controller不对该文件注释解析
      if (!blocks || !hasController(blocks[0])) continue;

      // 当前注释块集合的所属tag-group, 并添加至swagger.tags中
      let controller = comment.getComment(blocks[0], _.CONTROLLER)[0];
      let tagName = controller[1] ? controller[1] : name.split(/\.(js|ts)/)[0];
      if (tagNames.includes(tagName)) {
        tagName = tagName + '_' + tagNames.length;
      }
      tagNames.push(tagName);

      tags.push({ name: tagName, description: controller[2] ? controller[2] : '' });

      // 获取所有的有效方法
      let func = generateAPIFunc(filepath);
      let bundler = {
        filePath: filepath,
        routers: [],
      };

      let routerlist = [];
      for (let i = 1; i < blocks.length; i++) {

        if (isIgnore(blocks[i])) continue;

        let direct = `${filepath.split(/\.(js|ts)/)[0].split('app')[1].substr(1)}`;
        // 解析路由
        let routers = comment.getComment(blocks[i], _.ROUTER);
        if (routers) {
          let path_method = {};
          path_method.tags = [tagName];
          path_method.summary = generateSummary(blocks[i]);
          path_method.description = generateDescription(blocks[i]);
          path_method.operationId = `${direct.replace(path.sep, '-')}-${func[i - 1]}`;
          path_method.consumes = generateConsumes(blocks[i], swagger);
          path_method.produces = generateProduces(blocks[i], swagger);
          path_method.parameters = generateRequest(blocks[i], routers, definitions);
          path_method.security = generateSecurity(blocks[i], securitys, swagger);
          path_method.responses = generateResponse(blocks[i], routers, definitions);
          path_method.deprecated = isDeprecated(blocks[i]);

          if (!routerlist.includes(routers[0][2])) {
            paths[routers[0][2]] = {};
          }

          routerlist.push(routers[0][2]);
          paths[routers[0][2]][routers[0][1].toLowerCase()] = path_method;

          // 绑定route和function
          let contractName = getContractInBody(blocks[i], definitions);
          let router = {
            method: routers[0][1].toLowerCase(),
            route: routers[0][2],
            func: func[i - 1],
            ruleName: contractName,
          };
          bundler.routers.push(router);
        }
      }
      FUNCTIONBUNDLER.push(bundler);
    }
  }

  return {
    tags,
    paths,
  };
}

/**
 * 判断是否包含@Controller标签
 * @param {String} block 注释块
 * @return {Boolean} 是否包含@Controller标签
 */
function hasController(block) {
  return block.indexOf('@Controller') > -1 || block.indexOf('@controller') > -1;
}

/**
 * 获取controller的方法， 按定义顺序
 * @param {String} filepath controller文件地址
 */
function generateAPIFunc(filepath) {
  let func = [];
  let obj = require(filepath);
  if (path.extname(filepath) === '.ts') {
    obj = obj.default;
  }

  let instance = obj.prototype || obj;
  func = Object.getOwnPropertyNames(instance).map(key => {
    return key;
  });

  if (func[0] === 'constructor') {
    func.shift();
  }

  return func;
}

/**
 * 是否跳过该方法
 * @param {string} block 注释块
 */
function isIgnore(block) {
  return block.indexOf('@Ignore') > -1 || block.indexOf('@ignore') > -1;
}

/**
 * 是否无效接口
 * @param {string} block 注释块
 */
function isDeprecated(block) {
  return block.indexOf('@Deprecated') > -1 || block.indexOf('@deprecated') > -1;
}

/**
 * 解析安全验证
 * @param {String} block 注释块
 * @param {Array} securitys 设定的安全验证名称
 * @param {Object} swagger swagger配置
 */
function generateSecurity(block, securitys, swagger) {
  let securityDoc = [];
  for (let security of securitys) {
    if (block.indexOf(`@${security}`) > -1) {
      let securityItem = {};
      if (swagger.securityDefinitions[security].type === 'apiKey') {
        securityItem[security] = [];
      }
      if (swagger.securityDefinitions[security].type === 'oauth2') {
        securityItem[security] = [];
        Object.keys(swagger.securityDefinitions[security].scopes).forEach(i => {
          securityItem[security].push(i);
        });
      }
      securityDoc.push(securityItem);
    }
  }
  return securityDoc;
}

/**
 * 获取api标题
 * @param {String} block 注释块
 */
function generateSummary(block) {
  let summary = '';
  let summarys = comment.getComment(block, _.SUMMARY);
  if (summarys) {
    let m = 1;
    while (summarys[0][m]) {
      summary = summary + summarys[0][m] + ' ';
      m++;
    }
  }
  return summary;
}
/**
 * 获取api接口描述
 * @param {String} block 注释块
 */
function generateDescription(block) {
  let description = '';
  let descriptions = comment.getComment(block.replace(/^\s+\*\s+^/gm, '\n').replace(/^\s+\*\s*/gm, ''), _.DESCRIPTION);
  if (descriptions) {
    let m = 1;
    while (descriptions[0][m]) {
      description = description + descriptions[0][m] + ' ';
      m++;
    }
  }
  return description;
}

/**
 * 获取请求的produces
 * @param {String} block comment block
 * @param {Object} swagger config of swagger
 */
function generateProduces(block, swagger) {
  let produces = [];
  let produceComments = comment.getComment(block, _.PRODUCE);
  if (produceComments) {
    for (let item of produceComments) {
      for (let key in item) {
        if (Number(key) === 0) continue;
        produces.push(item[key]);
      }
    }
  } else {
    produces = swagger.produces;
  }
  return produces;
}

/**
 * 获取请求的consumes
 * @param {String} block comment block
 * @param {Object} swagger config of swagger
 */
function generateConsumes(block, swagger) {
  let consumes = [];
  let consumeComments = comment.getComment(block, _.CONSUME);
  if (consumeComments) {
    for (let item of consumeComments) {
      for (let key in item) {
        if (Number(key) === 0) continue;
        consumes.push(item[key]);
      }
    }
  } else {
    consumes = swagger.consumes;
  }
  return consumes;
}

/**
 * 获取请求参数
 * @param {String} block 注释块
 * @param {Array} routers 路由列表
 * @param {Object} definitions contract信息
 */
function generateRequest(block, routers, definitions) {
  let parameters = [];
  let requests = comment.getComment(block, _.REQUEST);
  if (requests) {
    for (let request of requests) {
      let parameter = generateParameters(request, routers, definitions);
      parameters.push(parameter);
    }
  }
  return parameters;
}

/**
 * 获取request in body
 * @param {String} block comment
 * @param {Object} definitions contract定义
 */
function getContractInBody(block, definitions) {
  let requests = comment.getComment(block, _.REQUEST);
  if (requests) {
    for (let request of requests) {
      if (request[1] === 'body' && definitions.hasOwnProperty(request[2])) {
        return request[2];
      }
    }
  }
}

/**
 * 获取响应参数
 * @param {String} block 注释块
 * @param {Array} routers 路由列表
 * @param {Object} definitions contract信息
 */
function generateResponse(block, routers, definitions) {
  let responseDoc = {};
  let responses = comment.getComment(block, _.RESPONSE);
  if (responses) {
    for (let response of responses) {
      let res = {};
      let schema = {};

      if (response[2]) {
        if (!definitions.hasOwnProperty(response[2])) {
          throw new Error(`[egg-swagger-doc] error at ${routers[0][1].toLowerCase()}:${routers[0][2]} ,the type of response parameter does not exit`);
        }
        schema.$ref = `#/definitions/${response[2]}`;
        res.schema = schema;
      }

      res.description = '';
      if (response[3]) {
        let m = 3;
        while (response[m]) {
          res.description = res.description + response[m] + ' ';
          m++;
        }
      }

      responseDoc[response[1]] = res;
    }
  } else {
    responseDoc.default = { description: 'successful operation' };
  }

  return responseDoc;
}
/**
 * 获取请求参数
 * @param {String} request 包含@Request的注释行,以空格分割的得到的数组
 * @param {Array} routers 路由信息
 * @param {Object} definitions contract信息
 */
function generateParameters(request, routers, definitions) {
  let parameter = {};

  parameter.in = request[1];
  if (parameter.in.toLowerCase() === 'body' && !_.itemType.includes(request[2])) {

    let schema = {};
    if (!request[2].startsWith('array')) {
      if (!definitions.hasOwnProperty(request[2])) {
        throw new Error(`[egg-swagger-doc] error at ${routers[0][1].toLowerCase()}:${routers[0][2]} ,the type of request parameter does not exit`);
      }
      schema.$ref = `#/definitions/${request[2]}`;
    } else {
      schema.type = 'array';
      let ObjectType = ['boolean', 'integer', 'number', 'string'];
      let items = {};
      let itemsType = request[2].substring(6, request[2].length - 1);
      if (ObjectType.includes(itemsType)) {
        items.type = itemsType;
      } else {
        if (!definitions.hasOwnProperty(itemsType)) {
          throw new Error(`[egg-swagger-doc] error at ${routers[0][1].toLowerCase()}:${routers[0][2]} ,the type of request parameter does not exit`);
        }
        items.$ref = `#/definitions/${itemsType}`;
      }
      schema.items = items;
    }

    parameter.schema = schema;

  } else {
    parameter.type = request[2];
  }

  if (request[3]) {
    parameter.name = request[3].replace('*', '');

    parameter.required = false;
    if (request[3].indexOf('*') > -1 || parameter.in === 'path') {
      parameter.required = true;
    }
  }

  if (parameter.in.toLowerCase() === 'body') {
    parameter.name = 'body';
    parameter.required = true;
  }

  parameter.description = '';

  let i = 4;
  while (request[i]) {
    if (request[i].indexOf('eg:') > -1) {
      parameter.example = request[i].replace('eg:', '');
    } else {
      parameter.description = parameter.description + request[i] + ' ';
    }
    i++;
  }

  return parameter;
}

module.exports = {

  documentInit: app => {

    if (!DOCUMENT) {
      buildDocument(app);
    }

    return DOCUMENT;
  },

  getFuncBundler: app => {
    if (!FUNCTIONBUNDLER) {
      buildDocument(app);
    }

    return FUNCTIONBUNDLER;
  },
};
