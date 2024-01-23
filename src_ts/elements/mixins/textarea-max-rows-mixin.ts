import {LitElement} from 'lit';
import {Constructor} from '../../typings/globals.types';
import {flush} from '@polymer/polymer/lib/utils/flush.js';
import {microTask} from '@polymer/polymer/lib/utils/async.js';

/*
 * Mixin for fix max-rows in etools-textarea.
 * @polymer
 * @mixinFunction
 */
export function TextAreaMaxRows<T extends Constructor<LitElement>>(superClass: T) {
  class TextAreaMaxRowsClass extends (superClass as Constructor<LitElement>) {
    connectedCallback() {
      super.connectedCallback();
      flush();
      const etoolsTextareas = this.shadowRoot.querySelectorAll('etools-textarea') || [];

      etoolsTextareas.forEach((etoolsTextarea: any) => {
        this.setMaxHeight(etoolsTextarea);
      });
    }

    setMaxHeight(etoolsTextarea: any) {
      if (!etoolsTextarea) {
        return false;
      }

      const paperInputContainer = etoolsTextarea.shadowRoot.querySelector('etools-input-container');
      const textareaAutogrow = paperInputContainer.querySelector('.etools-input-input');
      const mirror = textareaAutogrow.shadowRoot.querySelector('#mirror');

      if (!textareaAutogrow) {
        return false;
      }

      const textareaAutogrowStyles = window.getComputedStyle(textareaAutogrow, null) || {};
      const maxRows = +etoolsTextarea.getAttribute('max-rows');

      if (!maxRows || maxRows <= 1) {
        return false;
      }

      microTask.run(() => {
        // @ts-ignore
        const lineHeight = textareaAutogrowStyles.lineHeight || '';
        const lineHeightPx = parseInt(lineHeight, 10);

        if (lineHeightPx) {
          const maxHeight = maxRows * lineHeightPx + 1;
          textareaAutogrow.style.maxHeight = `${maxHeight}px`;
          mirror.style.maxHeight = `${maxHeight}px`;
        }
        mirror.style.overflow = 'auto';
      });
      return true;
    }
  }
  return TextAreaMaxRowsClass;
}
