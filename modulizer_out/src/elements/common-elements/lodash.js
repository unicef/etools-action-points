import 'lodash';

_.mixin({
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
