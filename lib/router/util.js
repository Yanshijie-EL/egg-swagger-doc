'use strict';
module.exports = {
  convertControllerPath: (controllerName, controller) => {
    let returnObj = {};
    const strArr = controllerName.split('.').slice(1);// controllerName格式：controller.data.apis.user.userController，转换成数组后需要把controller删除掉
    const iter = strArr[Symbol.iterator]();
    function convertObj(obj) {
      const next = iter.next();
      if (!next.done) {
        const tmp = next.value;
        const tmpObj = {};
        tmpObj[next.value] = obj[tmp];
        returnObj = tmpObj;
        convertObj(obj[tmp]);
      }
      return returnObj;
    }
    const rs = convertObj(controller);
    return rs[strArr.pop()];
  },

};
