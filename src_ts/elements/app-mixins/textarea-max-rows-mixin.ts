import {PolymerElement} from '@polymer/polymer';
import {Constructor} from '../../typings/globals.types';
import {flush} from '@polymer/polymer/lib/utils/flush.js';
import {microTask} from '@polymer/polymer/lib/utils/async.js';

/*
 * Mixin for fix max-rows in paper-textarea.
 * @polymer
 * @mixinFunction
 */
export function TextAreaMaxRows<T extends Constructor<PolymerElement>>(superClass: T) {
  class TextAreaMaxRowsClass extends (superClass as Constructor<PolymerElement>) {
    connectedCallback() {
      super.connectedCallback();
      flush();
      let paperTextareas = this.shadowRoot.querySelectorAll('paper-textarea') || [];

      paperTextareas.forEach((paperTextarea: any) => {
        this.setMaxHeight(paperTextarea);
      });
    }

    setMaxHeight(paperTextarea: any) {
      if (!paperTextarea) {return false;}

      let paperInputContainer = paperTextarea.shadowRoot.querySelector('paper-input-container');
      let textareaAutogrow = paperInputContainer.querySelector('.paper-input-input');
      let mirror = textareaAutogrow.shadowRoot.querySelector('#mirror');

      if (!textareaAutogrow) {return false;}

      let textareaAutogrowStyles = window.getComputedStyle(textareaAutogrow, null) || {};
      let maxRows = +paperTextarea.getAttribute('max-rows');

      if (!maxRows || maxRows <= 1) {return false;}

      microTask.run(() => {
        // @ts-ignore
        const lineHeight = textareaAutogrowStyles.lineHeight || '';
        const lineHeightPx = parseInt(lineHeight, 10);

        if (lineHeightPx) {
          let maxHeight = maxRows * lineHeightPx + 1;
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
