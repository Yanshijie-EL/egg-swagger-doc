'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller
 */
class ResourceController extends Controller {
  /**
   * @Summary 创建资源
   * @Router POST /resource
   * @Request body createResource *body resourceInfo
   * @Request header string access_token
   * @Response 200 baseResponse
   */
  async index() {
    this.ctx.body = {
      result: true
    };
  }
}

module.exports = ResourceController;
