import * as _ from 'lodash';

let _staticData = {};
/*
 * Mixin for manage static data application.
 * @polymer
 * @mixinFunction
 */
const StaticDataMixin = (superClass: any) => class extends superClass {
  _setData(key, data) {
    if (!key || !data || _staticData[key]) {
      return false;
    }
    _staticData[key] = _.cloneDeep(data);
    return true;
  }
  getData(key) {
    return _.cloneDeep(_staticData[key]);
  }

  _updateData(key, data) {
    if (!key || !data || !_staticData[key]) {
      return false;
    }
    _staticData[key] = _.cloneDeep(data);
    return true;
  }
};

export default StaticDataMixin;
