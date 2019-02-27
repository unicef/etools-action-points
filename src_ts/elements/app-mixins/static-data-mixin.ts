// import cloneDeep from 'lodash/cloneDeep';
// import * as _ from 'lodash/index.js';
// import cloneDeep from 'lodash-es/cloneDeep.js'

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
    _staticData[key] = JSON.parse(JSON.stringify(data));
    return true;
  }

  getData(key: string) {
    if (!key || !_staticData[key]) {
      return;
    }
    return JSON.parse(JSON.stringify(_staticData[key]));
  }

  _updateData(key: string, data: any) {
    if (!key || !data || !_staticData[key]) {
      return false;
    }
    _staticData[key] = JSON.parse(JSON.stringify(data));
    return true;
  }
};

export default StaticDataMixin;
