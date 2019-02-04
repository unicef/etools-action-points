import * as _ from 'lodash';

export default _.mixin({
  isJSONObj: (str: string) => {
    var json;
    try {
      json = JSON.parse(str);
    } catch (e) {
      return false;
    }
    return _.isObject(json);
  }
});
