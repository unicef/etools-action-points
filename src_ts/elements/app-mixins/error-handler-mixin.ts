import {getFieldAttribute} from './permission-controller.js';
import {Constructor} from '../../typings/globals.types.js';
import {PolymerElement} from '@polymer/polymer';

/**
 * Mixin error handling
 * @param superClass
 * @constructor
 */
export function ErrorHandler<T extends Constructor<PolymerElement>>(superClass: T) {
  class ErrorHandlerClass extends (superClass as Constructor<PolymerElement>) {
    public refactorErrorObject(errorData: any) {
      if (!errorData) {
        return {};
      }

      if (typeof errorData != 'object') {
        return errorData;
      }
    }

    protected _checkInvalid(value: any) {
      return !!value;
    }

    public errorHandler(errorObject: any, permissionPath: string) {
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
    public _getErrors(errors: any, permissionPath: string, basePath: string[] = []) {
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
    public _getErrorMessage(field: string, error: string, permissionPath: string) {
      let fieldLabel = getFieldAttribute(`${permissionPath}.${field}`, 'label');
      return `${fieldLabel}: ${error}`;
    }

    protected _getNonFieldsMessage(errorObj: any) {
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

    public _responseError(message: string, type?: string, eventType: string = 'error') {
      let console: any;
      console[eventType](`Can not load initial data: ${message || '?'}. Reason: ${type || '?'}`);
    }
  }
  return ErrorHandlerClass;
}
