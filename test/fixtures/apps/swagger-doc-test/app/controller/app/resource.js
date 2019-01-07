'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller app
 */
class ResourceController extends Controller {
  /**
   * @Summary 创建资源
   * @Router POST /resource2
   * @Request body createResource *body resourceInfo
   * @Request header string access_token
   * @Response 200 baseResponse
   */
  async index() {
    this.ctx.body = {
      result: true
    };
  }

    /**
   * @Summary 创建资源
   * @Router POST /resource/create2
   * @Request body createResource *body resourceInfo
   * @Request header string access_token
   * @Response 200 baseResponse
   */
  
  async create() {
    this.ctx.body = {
      result: true
    };
  }
}

module.exports = ResourceController;
