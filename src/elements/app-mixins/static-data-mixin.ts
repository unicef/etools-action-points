import * as _ from 'lodash';

let _staticData: any = {};
/*
 * Mixin for manage static data application.
 * @polymer
 * @mixinFunction
 */
const StaticDataMixin = (superClass: any) => class extends superClass {
  _setData(key: string, data: any) {
    if (!key || !data || _staticData[key]) {
      return false;
    }
    _staticData[key] = _.cloneDeep(data);
    return true;
  }
  getData(key: string) {
    return _.cloneDeep(_staticData[key]);
  }

  _updateData(key: string, data: any) {
    if (!key || !data || !_staticData[key]) {
      return false;
    }
    _staticData[key] = _.cloneDeep(data);
    return true;
  }
};

export default StaticDataMixin;
