import {flush} from '@polymer/polymer/lib/utils/flush';
import {microTask} from '@polymer/polymer/lib/utils/async';

/*
 * Mixin for fix max-rows in paper-textarea.
 * @polymer
 * @mixinFunction
 */
const TextareaMaxRows = (superClass: any) => class extends superClass {
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
      let lineHeight = textareaAutogrowStyles.lineHeight || '';
      let lineHeightPx = parseInt(lineHeight, 10);

      if (lineHeightPx) {
        let maxHeight = maxRows * lineHeightPx + 1;
        textareaAutogrow.style.maxHeight = `${maxHeight}px`;
        mirror.style.maxHeight = `${maxHeight}px`;
      }
      // textareaAutogrow.textarea.style.overflow = 'auto';
      mirror.style.overflow = 'auto';
    });
    return true;
  }
};

export default TextareaMaxRows;
