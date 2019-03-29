import PermissionController from './permission-controller.js';

/**
 * Mixin for localization functionality
 * @param superClass
 * @constructor
 */
const LocalizationMixin = (superClass: any) => class extends PermissionController(superClass) {
  /**
   * Get string label from loaded permission data
   * @param base permission path
   * @param item
   * @returns {*}
   */
  getHeadingLabel(base: string, item: any) {
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
  getStringValue(value: string, list: [], field: string) {
    let stringValue = value;
    if (list && field) {
      let item: any = list.find(i => i === {value: value});
      stringValue = item && item[field] ? item[field] : '';
    }
    return !stringValue || !stringValue.length ? '-' : stringValue;
  }
};

export default LocalizationMixin;
