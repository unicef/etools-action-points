import moment from 'moment';

/**
 * Mixin for parsing and format date by pattern
 * @polymer
 * @mixinFunction
 */
const DateMixin = (superClass: any) =>
  class extends superClass {
    /**
     * Format date from string
     */
    public prettyDate(dateString: string, format?: string | undefined, placeholder?: string) {
      format = this._getFormat(format);
      let date: any = this._getMomentDate(dateString);
      let ph = placeholder ? placeholder : '';
      return date ? date.utc().format(format) : ph;
    }

    public formatDateInLocal(dateString: string, format: string) {
      format = this._getFormat(format);
      let date: any = this._getMomentDate(dateString);

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

    protected _getMomentDate(dateString: string) {

      // if (typeof dateString === 'string') {
      //   return '';
      // }

      let date = new Date(dateString);
      return date.toString() !== 'Invalid Date' ? moment(date) : '';
    }
  };

export default DateMixin;