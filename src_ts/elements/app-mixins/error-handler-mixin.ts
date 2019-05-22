import PermissionController from './permission-controller.js';

/**
 * Mixin error handling
 * @param superClass
 * @constructor
 */
const ErrorHandlerMixin = (superClass: any) => class extends PermissionController(superClass) {
  refactorErrorObject(errorData: any) {
    if (!errorData) {
      return {};
    }

    if (typeof errorData != 'object') {
      return errorData;
    }

    // if (typeof errorData === 'array') {
    //   return typeof errorData[0] === 'object' && !!errorData[0] ?
    //     errorData.map(object => this.refactorErrorObject(object)) : errorData[0];
    // } else {
    //   _.forOwn(errorData, (value, key) => {
    //     errorData[key] = this.refactorErrorObject(value);
    //   });
    //   return errorData;
    // }

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
  _getErrors(errors: any, permissionPath: string, basePath: string[] = []) {
    let messages: string[] = [];
    if (!errors) {
      return messages;
    }
    Object.keys(errors).forEach((errorField) => {
      let fieldPath = basePath.concat([errorField]);
      let data = Array.isArray(errors[errorField]) ? errors[errorField] : [errors[errorField]];
      for (let error of data) {
        if (typeof error === 'string') {
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
    if (typeof errorObj != 'object') {
      return null;
    }

    let message: string | null = null;
    if (Array.isArray(errorObj)) {
      for (let value of errorObj) {
        let recursive: string | null = this._getNonFieldsMessage(value);
        recursive && !message ? message = recursive : null;
      }
    } else {
      Object.keys(errorObj).forEach((key) => {
        if (key === 'non_field_errors') {
          message = errorObj[key];
        } else {
          let recursive = this._getNonFieldsMessage(errorObj[key]);
          recursive && !message ? message = recursive : null;
        }
      });
    }
    return message;
  }

  _responseError(message: string, type?: string, eventType: string = 'error') {
    let console: any;
    console[eventType](`Can not load initial data: ${message || '?'}. Reason: ${type || '?'}`);
  }
};

export default ErrorHandlerMixin;
