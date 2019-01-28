import '../common-elements/lodash.js';
import './permission-controller.js';

window.APDMixins = window.APDMixins || {};
/**
 * Mixin error handling
 * @param superClass
 * @constructor
 */
window.APDMixins.ErrorHandlerMixin = superClass => class extends APDMixins.PermissionController(superClass) {
  refactorErrorObject(errorData) {
    if (!errorData) {
      return {};
    }

    if (!_.isObject(errorData)) {
      return errorData;
    }

    if (_.isArray(errorData)) {
      return _.isObject(errorData[0]) && !!errorData[0] ?
        errorData.map(object => this.refactorErrorObject(object)) : errorData[0];
    } else {
      _.forOwn(errorData, (value, key) => {
        errorData[key] = this.refactorErrorObject(value);
      });
      return errorData;
    }

  }

  _checkInvalid(value) {
    return !!value;
  }

  errorHandler(errorObject, permissionPath) {
    let errorMessages = errorObject ? this._getErrors(errorObject.response, permissionPath) : [];
    let nonFieldMessage = this._getNonFieldsMessage(errorObject);
    if (nonFieldMessage) {
      errorMessages.push(nonFieldMessage);
    }
    for (let message of errorMessages) {
      this.dispatchEvent(new CustomEvent('toast', {
        detail: {
          text: message
        },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Get array of errors for displaying from error response
   * @param errors
   * @param permissionPath
   * @param basePath
   * @returns {Array}
   * @private
   */
  _getErrors(errors, permissionPath, basePath = []) {
    let messages = [];
    if (!errors) {
      return messages;
    }
    _.each(errors, (errorData, errorField) => {
      let fieldPath = basePath.concat([errorField]);
      let data = _.isArray(errorData) ? errorData : [errorData];
      for (let error of data) {
        if (_.isString(error)) {
          let message = this._getErrorMessage(fieldPath.join('.'), error, permissionPath);
          messages.push(message);
        } else {
          let subMessages = this._getErrors(error, permissionPath, fieldPath);
          messages = messages.concat(subMessages);
        }
      }
    });
    return messages;
  }

  /**
   * Format error string for displaying
   * @param field full path
   * @param error message
   * @param permissionPath
   * @returns {string}
   * @private
   */
  _getErrorMessage(field, error, permissionPath) {
    let fieldLabel = this.getFieldAttribute(`${permissionPath}.${field}`, 'label');
    return `${fieldLabel}: ${error}`;
  }

  _getNonFieldsMessage(errorObj) {
    if (!_.isObject(errorObj)) {
      return null;
    }

    let message = null;
    if (_.isArray(errorObj)) {
      for (let value of errorObj) {
        let recursive = this._getNonFieldsMessage(value);
        recursive && !message ? message = recursive : null;
      }
    } else {
      _.each(errorObj, (value, key) => {
        if (key === 'non_field_errors') {
          message = value;
        } else {
          let recursive = this._getNonFieldsMessage(value);
          recursive && !message ? message = recursive : null;
        }
      });
    }
    return message;
  }

  _responseError(message, type, eventType = 'error') {
    console[eventType](`Can not load initial data: ${message || '?'}. Reason: ${type || '?'}`);
  }
};
