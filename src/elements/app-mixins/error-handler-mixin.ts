// import isObject from 'lodash/isObject';
// import isArray from 'lodash/isArray';
// import forOwn from 'lodash/forOwn';
// import each from 'lodash/each';
// import isString from 'lodash/isString';
import * as _ from 'lodash';
import PermissionController from './permission-controller.js';

/**
 * Mixin error handling
 * @param superClass
 * @constructor
 */
const ErrorHandlerMixin = (superClass: any) => class extends PermissionController(superClass) {
  // @ts-ignore
  refactorErrorObject(errorData: any) {
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

  _checkInvalid(value: any) {
    return !!value;
  }

  errorHandler(errorObject: any, permissionPath: string) {
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
  _getErrors(errors: string[], permissionPath: string, basePath: number[] = []) {
    let messages: string[] = [];
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
  _getErrorMessage(field: string, error: string, permissionPath: string) {
    let fieldLabel = this.getFieldAttribute(`${permissionPath}.${field}`, 'label');
    return `${fieldLabel}: ${error}`;
  }

  // @ts-ignore
  _getNonFieldsMessage(errorObj: any) {
    if (!_.isObject(errorObj)) {
      return null;
    }

    let message: string | null = null;
    if (_.isArray(errorObj)) {
      for (let value of errorObj) {
        let recursive: string | null = this._getNonFieldsMessage(value);
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

  _responseError(message: string, type?: string, eventType: string = 'error') {
    var console: any
    console[eventType](`Can not load initial data: ${message || '?'}. Reason: ${type || '?'}`);
  }
};

export default ErrorHandlerMixin;
