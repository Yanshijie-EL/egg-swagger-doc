'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller ticket
 */
class TicketController extends Controller {
  /**
   * @apikey
   * @Router POST /ticket
   * @Request body createUser name description-createUser
   * @Request header string access_token
   * @Response 200 baseResponse ok
   */
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }

  /**
 * @Router PUT /ticket
 * @Request body updateUser name description-createUser
 * @Request header string access_token
 */
  async index2() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }
}

module.exports = TicketController;
