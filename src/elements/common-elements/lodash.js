// ximport '../../../node_modules/lodash/lodash';

export default _.mixin({
  isJSONObj: (str) => {
    var json;
    try {
      json = JSON.parse(str);
    } catch (e) {
      return false;
    }
    return _.isObject(json);
  }
});
