'use strict';

module.exports = {
  /**
   * swagger version 2.0
   */
  SWAGGERVERSION: '2.0',
  /**
   * request 中 {type} 支持的基础类型 string,number,boolean,integer,array,file
   */
  type: ['string', 'number', 'boolean', 'integer', 'array', 'file'],

  /**
   * contract 中内部itemType不需特殊处理的类型 string,number,boolean,integer,array
   */
  itemType: ['string', 'number', 'boolean', 'integer', 'array'],

  /**
   * regex for controller
   */
  CONTROLLER: /(@[c|C]ontroller.*\r\n)|(@[c|C]ontroller.*\r)|(@[c|C]ontroller.*\n)/gm,

  /**
   * regex for router
   */
  ROUTER: /(@[r|R]outer.*\r\n)|(@[r|R]outer.*\r)|(@[r|R]outer.*\n)/gm,

  /**
   * regex for summary
   */
  SUMMARY: /(@[s|S]ummary.*\r\n)|(@[s|S]ummary.*\r)|(@[s|S]ummary.*\n)/gm,

  /**
   * regex for description
   */
  DESCRIPTION: /@[d|D]escription\s*\(?(?:[^@]*[^*\s\/)])?(?:\s|$|\))/gm,

  /**
   * regex for request
   */
  REQUEST: /(@[r|R]equest.*\r\n)|(@[r|R]equest.*\r)|(@[r|R]equest.*\n)/gm,

  /**
   * regex for response
   */
  RESPONSE: /(@[r|R]esponse.*\r\n)|(@[r|R]esponse.*\r)|(@[r|R]esponse.*\n)/gm,

  /**
   * regex for CONSUME
   */
  CONSUME: /(@[c|C]onsume.*\r\n)|(@[c|C]onsume.*\r)|(@[c|C]onsume.*\n)/gm,

  /**
   * regex for PRODUCE
   */
  PRODUCE: /(@[p|P]roduce.*\r\n)|(@[p|P]roduce.*\r)|(@[p|P]roduce.*\n)/gm,

};
