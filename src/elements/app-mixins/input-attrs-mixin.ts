import '../common-elements/lodash.js';
import PermissionController from './permission-controller.js';

/*
 * Mixin for input field functionality.
 * @polymer
 * @mixinFunction
 */
const InputAttrs = (superClass: any) => class extends PermissionController(superClass) {
  /**
   * Set required class from OPTIONS data by path
   * @param field
   * @param basePermissionPath
   * @returns {*}
   * @private
   */
  _setRequired(field, basePermissionPath) {
    if (!basePermissionPath) {
      return false;
    }

    let required = this.isRequired(`${basePermissionPath}.${field}`);

    return required ? 'required' : false;
  }

  /**
   * Get label from OPTIONS data by path
   * @param path
   * @param base
   * @returns {*}
   */
  getLabel(path, base) {
    if (!base) {
      return '';
    }
    return this.getFieldAttribute(`${base}.${path}`, 'label', 'GET');
  }

  /**
   * Get placeholder text from OPTIONS data by path
   * @param path
   * @param base
   * @param special
   * @returns {*}
   */
  getPlaceholderText(path, base, special) {
    if (this.isReadonly(`${base}.${path}`)) {
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
  isReadOnly(field, basePermissionPath, inProcess) {
    if (!basePermissionPath || inProcess) {
      return true;
    }

    let readOnly = this.isReadonly(`${basePermissionPath}.${field}`);
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
  _resetFieldError(event) {
    if (!event || !event.target) {
      return false;
    }

    let field = event.target.getAttribute('field');
    if (field) {
      this.set(`errors.${field}`, false);
    }

    event.target.invalid = false;
  }

  _resetInputs() {
    let elements = this.shadowRoot.querySelectorAll('.validate-input');
    for (let element of elements) {
      element.invalid = false;
      element.value = '';
    }
  }
};

export default InputAttrs;
