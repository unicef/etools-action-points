import * as _ from 'lodash';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom';
import moment from 'moment';

/**
 * Mixin for parsing and format date by pattern
 * @polymer
 * @mixinFunction
 */
const DateMixin = (superClass: any) => class extends superClass {
    /**
     * Format date from string
     */
    prettyDate(dateString: string, format?: string | undefined, placeholder?: string) {
        format = this._getFormat(format);
        let date: any = this._getMomentDate(dateString);
        let ph = placeholder ? placeholder : '';
        return date ? date.utc().format(format) : ph;
    }

    formatDateInLocal(dateString: string, format: string) {
        format = this._getFormat(format);
        let date: any = this._getMomentDate(dateString);

        return date ? date.format(format) : '';
    }

    /**
     * Prepare date from string
     */
    prepareDate(dateString: string) {
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

    /**
     * Open input field assigned(as prefix or suffix) etools-datepicker on tap.
     * Make sure you also have the data-selector attribute set on the input field.
     */
    openDatePicker(event: CustomEvent) {
        // do not close datepicker on mouse up
        this.datepickerModal = true;
        // @ts-ignore
        let id = dom(event).localTarget.getAttribute('data-selector');
        if (id) {
            let datepickerId = '#' + id;
            let datePicker = this.shadowRoot.querySelector(datepickerId);
            if (datePicker) {
                datePicker.open = true;
            }
        }
        // allow outside click closing
        setTimeout(() => this.datepickerModal = false, 300);
    }

    _getFormat(format: string | undefined) {
        return !format || !_.isString(format) ? 'D MMM YYYY' : format;
    }

    _getMomentDate(dateString: string) {
        if (!_.isString(dateString)) {
            return '';
        }

        let date = new Date(dateString);
        return date.toString() !== 'Invalid Date' ? moment(date) : '';
    }
};

export default DateMixin;
