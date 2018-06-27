'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller user
 */
class HomeController extends Controller {
  /**
   * @apikey
   * @Router POST /user
   * @Request body createUser name description-createUser
   * @Request header string access_token
   * @Response 200 baseResponse ok
   */
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }

  /**
 * @Router PUT /user
 * @Request body updateUser name description-updateUser
 * @Request header string access_token
 */
  async index2() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }
}

module.exports = HomeController;
