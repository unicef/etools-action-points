import {LitElement} from 'lit-element';
import {getFieldAttribute} from './permission-controller.js';
import {Constructor} from '../../typings/globals.types.js';

/**
 * Mixin for localization functionality
 * @param superClass
 * @constructor
 */
export function LocalizationMixin<T extends Constructor<LitElement>>(superClass: T) {
  class LocalizationClass extends superClass {
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

      const labelPath = item.labelPath || item.path;
      const label = getFieldAttribute(`${base}.${labelPath}`, 'label', 'GET');

      return label && typeof label === 'string' ? label : item.label || '';
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
        const item: any = list.find((i) => i['value'] === value);
        stringValue = item && item[field] ? item[field] : '';
      }
      return !stringValue || !stringValue.length ? '-' : stringValue;
    }

    public getStringValueOrEmpty(value: string) {
      return value || '';
    }
  }
  return LocalizationClass;
}
