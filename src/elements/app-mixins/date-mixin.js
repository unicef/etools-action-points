import '../common-elements/lodash';
import {dom} from '@polymer/polymer/lib/legacy/polymer.dom.js';

window.APDMixins = window.APDMixins || {};
/**
 * Mixin for parsing and format date by pattern
 * @polymer
 * @mixinFunction
 */
window.APDMixins.DateMixin = superClass => class extends superClass {
    /**
     * Format date from string
     */
    prettyDate(dateString, format, placeholder) {
        format = this._getFormat(format);
        let date = this._getMomentDate(dateString);
        let ph = placeholder ? placeholder : '';
        return date ? date.utc().format(format) : ph;
    }

    formatDateInLocal(dateString, format) {
        format = this._getFormat(format);
        let date = this._getMomentDate(dateString);

        return date ? date.format(format) : '';
    }

    /**
     * Prepare date from string
     */
    prepareDate(dateString) {
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
    openDatePicker(event) {
        // do not close datepicker on mouse up
        this.datepickerModal = true;
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

    _getFormat(format) {
        return !format || !_.isString(format) ? 'D MMM YYYY' : format;
    }

    _getMomentDate(dateString) {
        if (!_.isString(dateString)) {
            return '';
        }

        let date = new Date(dateString);
        return date.toString() !== 'Invalid Date' ? moment(date) : '';
    }
};
