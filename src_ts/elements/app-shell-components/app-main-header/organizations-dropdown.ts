import {LitElement, html} from 'lit';
import {query, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import {getEndpoint} from '../../../endpoints/endpoint-mixin';
import {DexieRefresh} from '@unicef-polymer/etools-utils/dist/singleton/dexie-refresh';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {headerDropdownStyles} from './header-dropdown-styles';

/**
 * @polymer
 * @customElement
 * @appliesMixin EtoolsAjaxRequestMixin
 */
class OrganizationsDropdown extends LitElement {
  render() {
    return html`
      ${headerDropdownStyles}
      <etools-dropdown
        transparent
        id="organizationSelector"
        class="w100 ${this.checkMustSelectOrganization(this.user)}"
        .selected="${this.currentOrganizationId}"
        placeholder="Select Organization"
        .options="${this.organizations}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${(e: CustomEvent) => this.onOrganizationChange(e)}"
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

  private _user!: any;
  @property({type: Object})
  get user() {
    return this._user;
  }

  set user(val: any) {
    this._user = val;
    this.onUserChange(this._user);
  }

  @query('#organizationSelector') organizationSelectorDropdown!: EtoolsDropdownEl;

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

    this.organizations = this.user.organizations_available;
    this.currentOrganizationId = this.user.organization?.id || null;
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
    sendRequest({
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
    DexieRefresh.refreshInProgress = false;
    window.location.href = `${window.location.origin}/apd/`;
  }
}

window.customElements.define('organizations-dropdown', OrganizationsDropdown);
