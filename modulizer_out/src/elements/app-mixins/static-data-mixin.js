import '../common-elements/lodash';

let _staticData = {};

window.APDMixins = window.APDMixins || {};
/*
 * Mixin for manage static data application.
 * @polymer
 * @mixinFunction
 */
window.APDMixins.StaticDataMixin = superClass => class extends superClass {
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
