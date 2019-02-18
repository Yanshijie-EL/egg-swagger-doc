'use strict';
const fs = require('fs');

module.exports = {
  /**
   * 获取指定文件中的注释块集合
   * @param {String} filePath 文件路径
   * @return {Array} 返回注释块集合
   */
  generateCommentBlocks: filePath => {
    let buffer = fs.readFileSync(filePath);
    let fileString = buffer.toString();
    const block_regex = /\/\*\*([\s\S]*?)\*\//gm;
    let blocks = fileString.match(block_regex);
    if (blocks) {
      let result = blocks.filter(value => {
        return value.indexOf('ontroller') > -1 || value.indexOf('outer') > -1 || value.indexOf('gnore') > -1;
      });
      return result;
    }
    return [];
  },
  /**
   * 获取块中包含指定标识的注释行，返回行中以空格分割的得到的数组
   * @param {String} commentBlock 注释
   * @param {String} regex 正则式
   * @return {*} 匹配成功返回行中以空格分割的得到的数组，否则false
   */
  getComment: (commentBlock, regex) => {
    let result = [];
    let comment_lines = commentBlock.match(regex);
    if (comment_lines) {
      for (let comment_line of comment_lines) {
        result.push(comment_line.slice(1, comment_line.length - 1).replace('\r', '').split(' '));
      }
      return result;
    }
    return false;
  },

};
