import {PolymerElement} from '@polymer/polymer';
import {getFieldAttribute} from './permission-controller.js';
import {Constructor} from '../../typings/globals.types.js';

/**
 * Mixin for localization functionality
 * @param superClass
 * @constructor
 */
export function LocalizationMixin<T extends Constructor<PolymerElement>>(superClass: T) {
  class LocalizationClass extends (superClass as Constructor<PolymerElement>) {
  /**
   * Get string label from loaded permission data
   * @param base permission path
   * @param item
   * @returns {*}
   */
    public getHeadingLabel(base: string, item: any) {
      if (!item) {
        return '';
      }
      if (!base) {
        return item.label || '';
      }

      let labelPath = item.labelPath || item.path;
      let label = getFieldAttribute(`${base}.${labelPath}`, 'label', 'GET');

      return (label && typeof label === 'string') ? label : (item.label || '');
    }

    /**
     * Format column data value also from list dropdown options
     * @param value for format
     * @param list of options
     * @param field of option in list
     * @returns {string} value for displaying
     */
    public getStringValue(value: string, list?: [], field?: string) {
      let stringValue = value;
      if (list && field) {
        let item: any = list.find(i => i['value'] === value);
        stringValue = item && item[field] ? item[field] : '';
      }
      return !stringValue || !stringValue.length ? '-' : stringValue;
    }
  }
  return LocalizationClass;
}
