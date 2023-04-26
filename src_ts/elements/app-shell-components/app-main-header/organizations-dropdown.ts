import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {property, query} from '@polymer/decorators';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-dropdown/etools-dropdown';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';

/**
 * @polymer
 * @customElement
 * @appliesMixin EtoolsAjaxRequestMixin
 */
class OrganizationsDropdown extends EtoolsAjaxRequestMixin(PolymerElement) {
  public static get template() {
    return html`
      <style>
        #organizationSelector {
          width: 170px;
        }
        etools-dropdown.warning {
          --paper-input-container: {
            padding-left: 3px;
            box-sizing: border-box;
            box-shadow: inset 0px 0px 0px 1.5px red;
          }
        }
        etools-dropdown {
           --esmm-icons: {
            color: var(--light-secondary-text-color);
            cursor: pointer;
          }
          --paper-input-container-underline: {
            display: none;
          }
          --paper-input-container-underline-focus: {
            display: none;
          }
          --paper-input-container-underline-disabled: {
            display: none;
          }
          --paper-input-container-shared-input-style: {
            color: var(--light-secondary-text-color);
            cursor: pointer;
            font-size: 16px;
            text-align: right;
            width: 100%;
          }
        }

      </style>
      <etools-dropdown
        id="organizationSelector"
        class$="[[checkMustSelectOrganization(user)]]"
        selected="[[currentOrganizationId]]"
        placeholder="Select Organization"
        options="[[organizations]]"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        on-etools-selected-item-changed="onOrganizationChange"
        allow-outside-scroll
        no-label-float
        hide-search
      >
      </etools-dropdown>
    `;
  }

  @property({type: Number})
  currentOrganizationId!: number | null;

  @property({type: Array})
  organizations: any[] = [];

  @property({type: Object})
  user!: any;

  @query('#organizationSelector') organizationSelectorDropdown!: EtoolsDropdownEl;

  public static get observers() {
    return ['onUserChange(user)'];
  }

  public connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
      if (fitInto && this.organizationSelectorDropdown) {
        this.organizationSelectorDropdown.fitInto = fitInto;
      }
    }, 500);
  }

  public onUserChange(user: any) {
    if (!user || !Object.keys(user).length) {
      return;
    }

    this.set('organizations', this.user.organizations_available);
    this.set('currentOrganizationId', this.user.organization?.id || null);
  }

  checkMustSelectOrganization(user) {
    if (user && user.user && !user.organization) {
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('toast', {
            detail: {
              text: 'Select Organization'
            },
            bubbles: true,
            composed: true
          })
        );
      }, 2000);
      return 'warning';
    }
    return '';
  }

  onOrganizationChange(e: CustomEvent) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedOrganizationId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedOrganizationId !== this.currentOrganizationId) {
      // send post request to change_organization endpoint
      this.triggerOrganizationChangeRequest(selectedOrganizationId);
    }
  }

  triggerOrganizationChangeRequest(organizationId) {
      this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          loadingSource: 'change-organization',
          active: true,
          message: 'Please wait while organization is changing...'
        },
        bubbles: true,
        composed: true
      })
    );
    const endpoint = getEndpoint('changeOrganization');
    this.sendRequest({
      method: 'POST',
      endpoint: endpoint,
      body: {organization: organizationId}
    })
      .then(this._handleResponse.bind(this))
      .catch(this._handleError.bind(this));
  }

  _handleError() {
    this.organizationSelectorDropdown.selected = this.currentOrganizationId;
    this.dispatchEvent(
      new CustomEvent('global-loading', {
        detail: {
          loadingSource: 'change-organization'
        },
        bubbles: true,
        composed: true
      })
    );
    this.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          text: 'Can not change organization. Please, try again later'
        },
        bubbles: true,
        composed: true
      })
    );
  }

  _handleResponse() {
    DexieRefresh.refreshInProgress = true;
    DexieRefresh.clearDexieDbs();
  }

  _refreshPage() {
    DexieRefresh.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}

window.customElements.define('organizations-dropdown', OrganizationsDropdown);
