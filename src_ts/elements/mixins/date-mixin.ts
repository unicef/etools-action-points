import {Constructor} from '../../typings/globals.types';
import {LitElement} from 'lit';
import dayjs from 'dayjs';

/**
 * Mixin for parsing and format date by pattern
 * @mixinFunction
 */
export function DateMixin<T extends Constructor<LitElement>>(superClass: T) {
  class DateMixinClass extends superClass {
    /**
     * Format date from string
     */
    public prettyDate(dateString: string, format?: string | undefined, placeholder?: string) {
      format = this._getFormat(format);
      const date: any = this._getDayjsDate(dateString);
      const ph = placeholder ? placeholder : '';
      return date ? date.utc().format(format) : ph;
    }

    public formatDateInLocal(dateString: string, format: string) {
      format = this._getFormat(format);
      const date: any = this._getDayjsDate(dateString);

      return date ? date.format(format) : '';
    }

    /**
     * Prepare date from string
     */
    public prepareDate(dateString: string) {
      if (typeof dateString === 'string' && dateString !== '') {
        let date = new Date(dateString);
        if (date.toString() === 'Invalid Date') {
          date = new Date();
        }
        return date;
      } else {
        return new Date();
      }
    }

    protected _getFormat(format: string | undefined) {
      return !format || typeof format != 'string' ? 'D MMM YYYY' : format;
    }

    protected _getDayjsDate(dateString: string) {
      const date = new Date(dateString);
      return date.toString() !== 'Invalid Date' ? dayjs(date) : '';
    }
  }
  return DateMixinClass;
}
