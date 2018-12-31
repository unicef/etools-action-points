import './permission-controller';

window.APDMixins = window.APDMixins || {};
/**
 * Mixin for localization functionality
 * @param superClass
 * @constructor
 */
window.APDMixins.LocalizationMixin = superClass => class extends APDMixins.PermissionController(superClass) {
  /**
   * Get string label from loaded permission data
   * @param base permission path
   * @param item
   * @returns {*}
   */
  getHeadingLabel(base, item) {
    if (!item) {
      return '';
    }
    if (!base) {
      return item.label || '';
    }

    let labelPath = item.labelPath || item.path;
    let label = this.getFieldAttribute(`${base}.${labelPath}`, 'label', 'GET');

    return (label && typeof label === 'string') ? label : (item.label || '');
  }

  /**
   * Format column data value also from list dropdown options
   * @param value for format
   * @param list of options
   * @param field of option in list
   * @returns {string} value for displaying
   */
  getStringValue(value, list, field) {
    let stringValue = value;
    if (!_.isNil(list) && !_.isNil(field)) {
      let item = _.find(list, {
        value: value
      });
      stringValue = item && item[field] ? item[field] : '';
    }
    return _.isNil(stringValue) || !stringValue.length ? '-' : stringValue;
  }
};
