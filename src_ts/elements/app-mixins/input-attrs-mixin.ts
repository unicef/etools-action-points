import {isRequired, getFieldAttribute, isReadOnly} from './permission-controller.js';
import {Constructor, GenericObject} from '../../typings/globals.types.js';
import {PolymerElement} from '@polymer/polymer';
import {property} from '@polymer/decorators';

/*
 * Mixin for input field functionality.
 * @polymer
 * @mixinFunction
 */
export function InputAttrs<T extends Constructor<PolymerElement>>(superClass: T) {
  class InputAttrsClass extends (superClass as Constructor<PolymerElement>) {

    @property({type: Object})
    errors: GenericObject;

    /**
   * Set required class from OPTIONS data by path
   * @param field
   * @param basePermissionPath
   * @returns {*}
   * @private
   */
    public _setRequired(field: string, basePermissionPath: any) {
      if (!basePermissionPath) {
        return false;
      }

      let required = isRequired(`${basePermissionPath}.${field}`);

      return required ? 'required' : false;
    }

    /**
     * Get label from OPTIONS data by path
     * @param path
     * @param base
     * @returns {*}
     */
    public getLabel(path: string, base: string) {
      if (!base) {
        return '';
      }
      return getFieldAttribute(`${base}.${path}`, 'label', 'GET');
    }

    /**
     * Get placeholder text from OPTIONS data by path
     * @param path
     * @param base
     * @param special
     * @returns {*}
     */
    public getPlaceholderText(path: string, base: string, special: boolean) {
      if (isReadOnly(`${base}.${path}`)) {
        return 'Empty Field';
      }

      let label = this.getLabel(path, base);
      let prefix = special ? 'Select' : 'Enter';
      return `${prefix} ${label}`;
    }

    /**
     * Get is readonly flag from OPTIONS data by path
     * @param field
     * @param basePermissionPath
     * @param inProcess
     * @returns {*}
     */
    public isReadOnly(field: string, basePermissionPath: string, inProcess?: boolean) {
      if (!basePermissionPath || inProcess) {
        return true;
      }

      let readOnly = isReadOnly(`${basePermissionPath}.${field}`);
      if (readOnly === null) {
        readOnly = true;
      }

      return readOnly;
    }

    /**
     * Reset highlight error fields
     * @param event
     * @returns {boolean}
     * @private
     */
    protected _resetFieldError(event: any) {
      if (!event || !event.target) {
        return false;
      }

      let field = event.target.getAttribute('field');
      if (field) {
        this.set(`errors.${field}`, false);
      }

      event.target.invalid = false;
      return true;
    }

    public _resetInputs() {
      let elements: NodeList = this.shadowRoot.querySelectorAll('.validate-input');
      elements.forEach((element: GenericObject) => {
        element.invalid = false;
        element.value = '';
      });
    }
  }
  return InputAttrsClass;
}
