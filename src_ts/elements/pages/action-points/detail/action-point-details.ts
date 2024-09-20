import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel.js';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading.js';
import '@unicef-polymer/etools-unicef/src/etools-date-time/datepicker-lite.js';
import {LocalizationMixin} from '../../../mixins/localization-mixin';
import {InputAttrsMixin} from '../../../mixins/input-attrs-mixin';
import {getEndpoint} from '../../../../endpoints/endpoint-mixin';
import {DateMixin} from '../../../mixins/date-mixin';
import {getData} from '../../../mixins/static-data-mixin';
import {actionAllowed} from '../../../mixins/permission-controller';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {sharedStyles} from '../../../styles/shared-styles';
import {tabInputsStyles} from '../../../styles/tab-inputs-styles';
import {moduleStyles} from '../../../styles/module-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {GenericObject} from '../../../../typings/globals.types';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import ComponentBaseMixin from '@unicef-polymer/etools-modules-common/dist/mixins/component-base-mixin';

const FM_OTHER = 16;
const AP_OTHER = 15;

@customElement('action-point-details')
export class ActionPointDetails extends ComponentBaseMixin(InputAttrsMixin(LocalizationMixin(DateMixin(LitElement)))) {
  @property({type: Array}) // notify: true
  partners: any[] = [];

  @property({type: String}) // notify: true
  permissionPath!: string;

  @property({type: Array})
  locations: any[] = [];

  @property({type: Object}) // notify: true
  actionPoint: GenericObject = {};

  @property({type: Object}) // notify: true
  editedItem: GenericObject = {};

  @property({type: Array}) // notify: true
  cpOutputs!: any[];

  @property({type: Array}) // notify: true
  interventions: any[] = [];

  @property({type: Array}) // notify: true
  modules!: any[];

  @property({type: Array}) // notify: true
  unicefUsers!: any[];

  private _apUnicefUsers!: any[];
  @property({type: Array})
  get apUnicefUsers() {
    return this._apUnicefUsers;
  }

  set apUnicefUsers(newVal: any[]) {
    this._apUnicefUsers = newVal;
    this.setAvailableUnicefUsers();
  }

  @property({type: Array}) // notify: true
  offices!: any[];

  @property({type: Array}) // notify: true
  sectionsCovered!: any[];

  @property({type: Object}) // notify: true
  originalActionPoint!: GenericObject;

  @property({type: Object})
  interventionsData: GenericObject = {};

  @property({type: Object})
  cpOutputsData: GenericObject = {};

  @property({type: Boolean})
  dataIsSet = false;

  @property({type: Boolean})
  partnerRequestInProcess!: boolean;

  @property({type: Number})
  lastPartnerId!: number;

  @property({type: Array})
  categories!: any[];

  @property({type: Object})
  partner: any;

  @property({type: String})
  warningCategoryMessage!: string;

  @property({type: Boolean})
  interventionRequestInProcess = false;

  @property({type: Object})
  datepickerModal: any;
  render() {
    return html`
      ${pageLayoutStyles} ${sharedStyles} ${tabInputsStyles} ${moduleStyles}
      <style>
        .loading {
          position: absolute;
          top: 28px;
          left: auto;
          background-color: #fff;
        }

        .loading:not([active]) {
          opacity: 0;
          z-index: -1;
        }

        .last-modify {
          padding: 19px 12px 17px;
          opacity: 0.8;
          text-align: right;
          font-size: var(--etools-font-size-12, 12px);
          color: var(--list-secondary-text-color, #757575);
        }

        .last-modify__author {
          font-weight: bold;
        }

        .reference-link {
          display: flex;
          flex-direction: column;
          padding: 8px 12px;
          position: relative;
        }

        .reference-link > label {
          font-size: var(--etools-font-size-16, 16px);
          width: 133%;
          transform: scale(0.75);
          transform-origin: left top;
          color: var(var(--secondary-text-color));
        }

        .reference-link > a {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--module-primary);
          font-weight: 500;
        }

        .reference-link > span {
          font-size: var(--etools-font-size-16, 16px);
          line-height: 16px;
          color: var(var(--gray-20));
        }
        datepicker-lite {
          --etools-icon-fill-color: var(--secondary-text-color);
        }
        .category-warning {
          color: #ea4022;
          margin-top: -6px;
          margin-left: 12px;
          font-size: var(--etools-font-size-12, 12px);
        }
      </style>

      <etools-content-panel class="content-section clearfix" panel-title="Action Points Details">
        <div class="row" ?hidden=${this.actionAllowed(this.permissionPath, 'create')}>
          <div class="col-md-4 col-12">
            <etools-dropdown
              class="validate-input readonly
                without-border ${this._setRequired('related_module', this.permissionPath)}"
              .selected="${this.editedItem?.related_module}"
              label="${this.getLabel('related_module', this.permissionPath)}"
              placeholder="-"
              .options="${this.modules}"
              option-label="display_name"
              option-value="value"
              ?required="${this._setRequired('related_module', this.permissionPath)}"
              ?readonly="${this.isReadOnly('related_module', this.permissionPath)}"
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('related_module', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('related_module', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
          <div class="col-md-4 col-12">
            <div class="reference-link">
              <label>${this.getLabel('related_object_str', this.permissionPath)}</label>
              <a
                ?hidden="${!this.editedItem.related_object_url}"
                target="_blank"
                href="${this.editedItem?.related_object_url}"
              >
                ${this.editedItem?.related_object_str}
              </a>
              <span ?hidden="${this.editedItem?.related_object_url}"
                >${this.getPlaceholderText('related_object_str', this.permissionPath, true)}</span
              >
            </div>
          </div>
          <div class="col-md-4 col-12">
            <etools-dropdown
              class="validate-input ${this._setRequired('assigned_by', this.permissionPath)}"
              .selected="${this.editedItem?.assigned_by}"
              label="${this.getLabel('assigned_by', this.permissionPath)}"
              placeholder="-"
              .options="${this.unicefUsers}"
              option-label="name"
              option-value="id"
              ?required="${this._setRequired('assigned_by', this.permissionPath)}"
              ?readonly="${this.isReadOnly('assigned_by', this.permissionPath)}"
              ?invalid="${this.errors.assigned_by}"
              .errorMessage="${this.errors.assigned_by}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('assigned_by', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('assigned_by', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
        </div>

        <div class="row">
          ${(this.showCategory(this.categories) &&
            html` <div class="col-12">
              <!-- Category -->
              <etools-dropdown
                class="validate-input ${this._setRequired('category', this.permissionPath)}"
                .selected="${this.editedItem?.category}"
                label="${this.getLabel('category', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('category', this.permissionPath, true)}"
                .options="${this.categories}"
                option-label="description"
                option-value="id"
                ?required="${this._setRequired('category', this.permissionPath)}"
                ?readonly="${this.isReadOnly('category', this.permissionPath)}"
                ?invalid="${this.errors.category}"
                .errorMessage="${this.errors.category}"
                @focus=${this._resetFieldError}
                @click=${this._resetFieldError}
                allow-outside-scroll
                dynamic-align
                ?trigger-value-change-event="${!this.isReadOnly('category', this.permissionPath)}"
                @etools-selected-item-changed="${({detail}: CustomEvent) => {
                  this.showHideCategoryWarning(detail.selectedItem?.id);
                  this.updateField('category', detail.selectedItem?.id)}}"
              >
              </etools-dropdown>
              <div class='category-warning' ?hidden="${!this.warningCategoryMessage}">${this.warningCategoryMessage}</div>
            </div>`) ||
          ''}
          <div class="col-md-6 col-12">
            <!-- Implementing Partner -->
            ${(!this.isReadOnly('partner', this.permissionPath) &&
              html`<etools-dropdown
                class="validate-input ${this._setRequired('partner', this.permissionPath)}"
                .selected="${this.editedItem?.partner}"
                label="${this.getLabel('partner', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('partner', this.permissionPath, true)}"
                .options="${this.partners}"
                option-label="name"
                option-value="id"
                ?required="${this._setRequired('partner', this.permissionPath)}"
                ?invalid="${this.errors.partner}"
                .errorMessage="${this.errors.partner}"
                @focus=${this._resetFieldError}
                @click=${this._resetFieldError}
                allow-outside-scroll
                dynamic-align
                ?trigger-value-change-event="${!this.isReadOnly('partner', this.permissionPath)}"
                @etools-selected-item-changed="${({detail}: CustomEvent) => {
                  this.updateField('partner', detail.selectedItem?.id);
                  this._requestPartner(this.editedItem.partner);
                }}"
              >
              </etools-dropdown>`) ||
            ''}
            ${(this.isReadOnly('partner', this.permissionPath) &&
              html`<etools-input
                label="${this.getLabel('partner', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('partner', this.permissionPath, true)}"
                value="${this.getStringValueOrEmpty(this.originalActionPoint?.partner?.name)}"
                readonly
              ></etools-input>`) ||
            ''}

            <etools-loading
              id="partnersSpinner"
              ?active="${this.isRequestInProcess('partner', this.permissionPath, this.partnerRequestInProcess)}"
              no-overlay
              loading-text=""
              class="loading"
            >
            </etools-loading>
          </div>
          <div class="col-md-6 col-12">
            <!-- PD/SSFA -->
            ${(!this.isReadOnly('intervention', this.permissionPath) &&
              html` <etools-dropdown
                class="validate-input ${this._setRequired('intervention', this.permissionPath)}"
                .selected="${this.editedItem?.intervention}"
                label="${this.getLabel('intervention', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('intervention', this.permissionPath, true)}"
                .options="${this.interventions}"
                option-label="title"
                option-value="id"
                ?required="${this._setRequired('intervention', this.permissionPath)}"
                ?invalid="${this.errors.intervention}"
                .errorMessage="${this.errors.intervention}"
                @focus=${this._resetFieldError}
                @click=${this._resetFieldError}
                allow-outside-scroll
                dynamic-align
                ?trigger-value-change-event="${!this.isReadOnly('intervention', this.permissionPath)}"
                @etools-selected-item-changed="${({detail}: CustomEvent) => {
                  const selectedValue = detail.selectedItem ? detail.selectedItem.id : null;
                  if (selectedValue !== this.editedItem.intervention && (this.interventions || []).length) {
                    this.updateField('intervention', detail.selectedItem?.id);
                    this._updateCpOutputs(this.editedItem.intervention);
                  }
                }}"
              >
              </etools-dropdown>`) ||
            ''}
            ${(this.isReadOnly('intervention', this.permissionPath) &&
              html`<etools-input
                label="${this.getLabel('intervention', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('intervention', this.permissionPath, true)}"
                value="${this.getStringValueOrEmpty(this.originalActionPoint?.intervention?.title)}"
                readonly
              ></etools-input>`) ||
            ''}

            <etools-loading
              id="pdsSpinner"
              ?active="${this.isRequestInProcess(
                'intervention',
                this.permissionPath,
                this.interventionRequestInProcess
              )}"
              no-overlay
              loading-text=""
              class="loading"
            >
            </etools-loading>
          </div>
          <div class="col-md-6 col-12">
            <!-- CP Output -->
            ${(!this.isReadOnly('cp_output', this.permissionPath) &&
              html` <etools-dropdown
                class="validate-input ${this._setRequired('cp_output', this.permissionPath)}"
                .selected="${this.editedItem?.cp_output}"
                label="${this.getLabel('cp_output', this.permissionPath)}"
                placeholder="${this.getPlaceholderText('cp_output', this.permissionPath, true)}"
                .options="${this.cpOutputs}"
                option-label="name"
                option-value="id"
                ?required="${this._setRequired('cp_output', this.permissionPath)}"
                ?invalid="${this.errors.cp_output}"
                .errorMessage="${this.errors.cp_output}"
                @focus=${this._resetFieldError}
                @click=${this._resetFieldError}
                allow-outside-scroll
                dynamic-align
                ?trigger-value-change-event="${!this.isReadOnly('cp_output', this.permissionPath)}"
                @etools-selected-item-changed="${({detail}: CustomEvent) => {
                  if (this.cpOutputs && this.cpOutputs.length) {
                    this.updateField('cp_output', detail.selectedItem?.id);
                  }
                }}"
              >
              </etools-dropdown>`) ||
            ''}
            ${(this.isReadOnly('cp_output', this.permissionPath) &&
              html` <etools-input
                .label="${this.getLabel('cp_output', this.permissionPath)}"
                .placeholder="${this.getPlaceholderText('cp_output', this.permissionPath, true)}"
                .value="${this.getStringValueOrEmpty(this.originalActionPoint?.cp_output?.name)}"
                readonly
              ></etools-input>`) ||
            ''}
          </div>
          <div class="col-md-6 col-12">
            <!-- Locations -->
            <etools-dropdown
              class="validate-input ${this._setRequired('location', this.permissionPath)}"
              .selected="${this.editedItem?.location}"
              label="${this.getLabel('location', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('location', this.permissionPath, true)}"
              .options="${this.locations}"
              option-label="name"
              option-value="id"
              ?required="${this._setRequired('location', this.permissionPath)}"
              ?readonly="${this.isReadOnly('location', this.permissionPath)}"
              ?invalid="${this.errors.location}"
              .errorMessage="${this.errors.location}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('location', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('location', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
          <div class="col-12">
            <!-- Description -->
            <etools-textarea
              class="validate-input ${this._setRequired('description', this.permissionPath)}"
              .value="${this.editedItem?.description}"
              label="${this.getLabel('description', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('description', this.permissionPath)}"
              ?required="${this._setRequired('description', this.permissionPath)}"
              ?readonly="${this.isReadOnly('description', this.permissionPath)}"
              max-length="800"
              ?invalid="${this.errors.description}"
              .errorMessage="${this.errors.description}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              @value-changed="${({detail}: CustomEvent) => this.updateField('description', detail.value)}"
              no-title-attr
            >
            </etools-textarea>
          </div>
          <div class="col-md-4 col-12">
            <!-- Assigned To -->
            <etools-dropdown
              class="validate-input ${this._setRequired('assigned_to', this.permissionPath)}"
              .selected="${this.editedItem?.assigned_to}"
              label="${this.getLabel('assigned_to', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('assigned_to', this.permissionPath, true)}"
              .options="${this.unicefUsers}"
              option-label="name"
              option-value="id"
              ?required="${this._setRequired('assigned_to', this.permissionPath)}"
              ?readonly="${this.isReadOnly('assigned_to', this.permissionPath)}"
              ?invalid="${this.errors.assigned_to}"
              .errorMessage="${this.errors.assigned_to}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('assigned_to', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('assigned_to', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
          <div class="col-md-4 col-12">
            <!-- Section -->
            <etools-dropdown
              class="validate-input ${this._setRequired('section', this.permissionPath)}"
              .selected="${this.editedItem?.section}"
              label="${this.getLabel('section', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('section', this.permissionPath, true)}"
              .options="${this.sectionsCovered}"
              option-label="name"
              option-value="id"
              ?required="${this._setRequired('section', this.permissionPath)}"
              ?readonly="${this.isReadOnly('section', this.permissionPath)}"
              ?invalid="${this.errors.section}"
              .errorMessage="${this.errors.section}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('section', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('section', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>
          <div class="col-md-4 col-12">
            <!-- Office -->
            <etools-dropdown
              class="validate-input ${this._setRequired('office', this.permissionPath)}"
              .selected="${this.editedItem?.office}"
              label="${this.getLabel('office', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('office', this.permissionPath, true)}"
              .options="${this.offices}"
              option-label="name"
              option-value="id"
              update-selected
              ?required="${this._setRequired('office', this.permissionPath)}"
              ?readonly="${this.isReadOnly('office', this.permissionPath)}"
              ?invalid="${this.errors.office}"
              .errorMessage="${this.errors.office}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              allow-outside-scroll
              dynamic-align
              ?trigger-value-change-event="${!this.isReadOnly('office', this.permissionPath)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateField('office', detail.selectedItem?.id)}"
            >
            </etools-dropdown>
          </div>

          <div class="col-md-4 col-12 input-checkbox-container">
            <!-- Priority -->
            <etools-checkbox
              ?checked="${this.editedItem?.high_priority}"
              ?disabled="${this.isReadOnly('high_priority', this.permissionPath)}"
              @sl-change=${(e: any) => {
                this.updateField('high_priority', e.target.checked);
              }}
            >
              ${this.getLabel('high_priority', this.permissionPath)}</etools-checkbox
            >
          </div>
          <div class="col-md-4 col-12">
            <!-- Due Date -->
            <datepicker-lite
              id="dueDate"
              class="validate-input ${this._setRequired('due_date', this.permissionPath)}"
              .label="${this.getLabel('due_date', this.permissionPath)}"
              .modal="${this.datepickerModal}"
              placeholder="${this.getPlaceholderText('due_date', this.permissionPath, true)}"
              slot="prefix"
              selected-date-display-format="D MMM YYYY"
              clear-btn-inside-dr
              ?required="${this._setRequired('due_date', this.permissionPath)}"
              ?readonly="${this.isReadOnly('due_date', this.permissionPath)}"
              @focus=${this._resetFieldError}
              @click=${this._resetFieldError}
              .errorMessage="${this.errors.due_date}"
              .value="${this.editedItem?.due_date}"
              fire-date-has-changed
              @date-has-changed="${this._dueDateChanged}"
            >
            </datepicker-lite>
          </div>

          <div class="col-md-4 col-12" ?hidden="${!this.editedItem.potential_verifier?.id}">
            <!-- Selected Verifier -->
            <etools-dropdown
              class="validate-input ${this._setRequired('potential_verifier', this.permissionPath)}"
              .selected="${this.editedItem?.potential_verifier?.id}"
              label="Selected Verifier"
              placeholder="${this.getPlaceholderText('potential_verifier', this.permissionPath, true)}"
              .options="${this.unicefUsers}"
              option-label="name"
              option-value="id"
              readonly
              allow-outside-scroll
              dynamic-align
            >
            </etools-dropdown>
          </div>

          <div class="col-md-4 col-12" ?hidden="${!this.editedItem.verified_by}">
            <!-- Verifier -->
            <etools-input
              label="${this.getLabel('verified_by', this.permissionPath)}"
              placeholder="${this.getPlaceholderText('verified_by', this.permissionPath, true)}"
              value="${this.getStringValueOrEmpty(this.editedItem?.verified_by?.name)}"
              readonly
            ></etools-input>
          </div>
          <div class="col-md-4 col-12" ?hidden="${!this.editedItem.verified_by}">
            <!-- Verification -->
            <etools-input
              label="Verification Result"
              value="${this.getVerificationWithTimestamp(
                this.editedItem?.is_adequate,
                this.editedItem?.date_of_verification
              )}"
              readonly
            ></etools-input>
          </div>
        </div>
        <div class="last-modify" ?hidden="${!this.editedItem.history?.[0]}">
          Last modify by
          <span class="last-modify__author">${this.editedItem?.history?.[0]?.by_user_display}</span>
          ${this.formatDateInLocal(this.editedItem.history?.[0]?.created, 'D MMM YYYY h:mm A')}
        </div>
      </etools-content-panel>
    `;
  }

  static get styles() {
    // language=CSS
    return [layoutStyles];
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('static-data-loaded', () => this.setData());
    document.addEventListener('locations-loaded', () => this._updateLocations());
    this.addEventListener('reset-validation', ({detail}: any) => {
      const elements: NodeList = this.shadowRoot!.querySelectorAll('.validate-input');
      elements.forEach((element: GenericObject) => {
        element.invalid = false;
        if (detail && detail.resetValues) {
          element.value = '';
        }
      });
    });
    if (!this.dataIsSet) {
      this.setData();
    }
  }

  updated(changedProperties: any) {
    if (changedProperties.has('actionPoint')) {
      this._updateEditedItem(this.actionPoint);
    }

    if (changedProperties.has('editedItem')) {
      this._setDrDOptions(this.editedItem);
    }

    if (changedProperties.has('partner') || changedProperties.has('originalActionPoint')) {
      this._updateInterventions(
        this.originalActionPoint?.intervention,
        this.originalActionPoint?.partner?.id,
        this.partner
      );
    }
  }

  showHideCategoryWarning(categoryId: number) {
    if (categoryId === FM_OTHER || categoryId === AP_OTHER) {
      this.warningCategoryMessage = "Are you sure that no other categories are suitable for this action point?";
    } else {
      this.warningCategoryMessage = "";
    }
  }

  _setDrDOptions(editedItem: any) {
    const module = editedItem && editedItem.related_module;
    let categories = [];
    if (module) {
      const categoriesList = getData('categoriesList');
      categories = categoriesList.filter((category: any) => category.module === module);

      setTimeout(() => {
        this.showHideCategoryWarning(editedItem.category);
      }, 100);
    }

    this.categories = categories;
  }

  setData() {
    this.modules = getData('modules');
    this.partners = getData('partnerOrganisations');
    this.offices = getData('offices');
    this.sectionsCovered = getData('sectionsCovered');
    this.cpOutputs = getData('cpOutputsList');
    this._updateLocations();
    this.dataIsSet = true;
  }

  setAvailableUnicefUsers() {
    const users = (getData('unicefUsers') || []).map((user: any) => {
      return {id: user.id, name: user.name};
    });

    this.addUsersNoLongerAssignedToCurrentCountry(users, this.apUnicefUsers);
    this.unicefUsers = users;
  }

  getVerificationWithTimestamp(is_adequate: boolean, verification_date: string) {
    if (!verification_date) {
      return '';
    }
    const verificationText = is_adequate ? 'Adequate' : 'Not Adequate';
    return `${verificationText} (${this.formatDateInLocal(verification_date, 'D MMM YYYY h:mm A')})`;
  }

  addUsersNoLongerAssignedToCurrentCountry(availableUsers: any[], savedUsers: any[]) {
    if (!(savedUsers && savedUsers.length > 0 && availableUsers && availableUsers.length > 0)) {
      return false;
    }
    let changed = false;
    savedUsers.forEach((savedUsr) => {
      if (availableUsers.findIndex((x) => x.id === savedUsr.id) < 0) {
        availableUsers.push(savedUsr);
        changed = true;
      }
    });
    if (changed) {
      availableUsers.sort((a, b) => (a.name < b.name ? -1 : 1));
    }
    return changed;
  }
  _updateEditedItem(actionPoint: any) {
    if (actionPoint && JSON.stringify(actionPoint) !== JSON.stringify(this.editedItem)) {
      if (actionPoint.intervention) {
        this._updateCpOutputs(actionPoint.intervention);
      }
      if (this.editedItem?.partner !== actionPoint?.partner) {
        this._requestPartner(actionPoint?.partner);
      }
      this.editedItem = {...actionPoint};
    }
  }

  _updateLocations(filter?: any) {
    const locations = getData('locations') || [];
    this.locations = locations.filter((location: any) => {
      return !filter || !!~filter.indexOf(+location.id);
    });
  }

  _requestPartner(partnerId: number) {
    if (this.partnerRequestInProcess || this.lastPartnerId === partnerId) {
      return;
    }
    this.lastPartnerId = partnerId;

    if (!partnerId && partnerId !== 0) {
      return;
    }

    this.partnerRequestInProcess = true;
    this.partner = null;
    if (this.originalActionPoint) {
      const originalPartner = this.originalActionPoint.partner ? this.originalActionPoint.partner.id : null;
      const originalIntervention = this.originalActionPoint.intervention
        ? this.originalActionPoint.intervention.id
        : null;
      if (partnerId !== originalPartner || this.editedItem.intervention !== originalIntervention) {
        this.editedItem.intervention = null;
      }
    }

    const endpoint = getEndpoint('partnerOrganisationDetails', partnerId);
    sendRequest({
      method: 'GET',
      endpoint
    })
      .then((data: any) => {
        this.partner = data || null;
        this.partnerRequestInProcess = false;
      })
      .catch(() => {
        console.error('Can not load partner data');
        this.partnerRequestInProcess = false;
      });
  }

  async _updateCpOutputs(interventionId: number) {
    if (interventionId === undefined) {
      return;
    }
    this._checkAndResetData(interventionId);
    if (interventionId === null) {
      this.cpOutputs = getData('cpOutputsList');
      this._updateLocations();
      return;
    }
    try {
      this.interventionRequestInProcess = true;
      this.cpOutputs = undefined;

      const intervention = await this._getIntervention(interventionId);

      const locations = (intervention && intervention.flat_locations) || [];
      this._updateLocations(locations);

      const resultLinks = intervention && intervention.result_links;
      if (!Array.isArray(resultLinks)) {
        this._finishCpoRequest();
        return;
      }

      const cpIds: string[] = [];
      resultLinks.forEach((link) => {
        if (link && (link.cp_output || link.cp_output === 0)) {
          cpIds.push(link.cp_output);
        }
      });

      if (!cpIds.length) {
        this._finishCpoRequest();
        return;
      }
      this.cpOutputs = await this._getCpOutputs(cpIds.join(','));
      this.interventionRequestInProcess = false;
    } catch (error) {
      console.error('Can not load cpOutputs data');
      this._finishCpoRequest();
    }
  }

  async _getIntervention(interventionId: number) {
    if (!this.interventionsData[interventionId]) {
      const interventionEndpoint = getEndpoint('interventionDetails', interventionId);
      this.interventionsData[interventionId] = await sendRequest({
        method: 'GET',
        endpoint: interventionEndpoint
      });
    }
    return this.interventionsData[interventionId];
  }

  async _getCpOutputs(cpIds: string) {
    if (!this.cpOutputsData[cpIds]) {
      const endpoint = getEndpoint('cpOutputsV2', cpIds);
      this.cpOutputsData[cpIds] =
        (await sendRequest({
          method: 'GET',
          endpoint: endpoint
        })) || [];
    }
    return this.cpOutputsData[cpIds];
  }

  _checkAndResetData(intervention: any) {
    if (!this.originalActionPoint) {
      return;
    }
    const originalIntervention = this.originalActionPoint.intervention
      ? this.originalActionPoint.intervention.id
      : null;
    const originalOutput = this.originalActionPoint.cp_output ? this.originalActionPoint.cp_output.id : null;
    const originalLocation = this.originalActionPoint.location ? this.originalActionPoint.location.id : null;
    const currentOutput = this.editedItem.cp_output;
    const currentLocation = this.editedItem.location;

    const interventionChanged = originalIntervention !== intervention;
    if (interventionChanged || originalOutput !== currentOutput) {
      this.editedItem.cp_output = null;
    }
    if (interventionChanged || originalLocation !== currentLocation) {
      this.editedItem.location = null;
    }
  }

  _finishCpoRequest() {
    this.cpOutputs = [];
    this.interventionRequestInProcess = false;
  }

  // 'originalActionPoint.intervention, originalActionPoint.partner.id, this.partner'
  _updateInterventions(intervention: any, partnerId: number, partner: any) {
    const interventions = (partner && partner.interventions) || [];
    const id = partner && partner.id;
    const exists =
      intervention &&
      interventions.find((item: any) => {
        return item.id === intervention.id;
      });

    if (intervention && (!id || id === partnerId) && !exists) {
      interventions.push(intervention);
    }

    this.interventions = interventions;
  }

  validate() {
    const elements: NodeList = this.shadowRoot!.querySelectorAll('.validate-input');
    let valid = true;
    elements.forEach((element: GenericObject) => {
      if (element.required && !element.disabled && !element.validate()) {
        const label = element.label || 'Field';
        element.errorMessage = `${label} is required`;
        element.invalid = true;
        valid = false;
      }
    });

    return valid;
  }

  getRefNumber(number: number) {
    return number || '-';
  }

  showCategory(categories: string[]) {
    return !!(categories && categories.length);
  }

  actionAllowed(path, action) {
    return actionAllowed(path, action);
  }

  _dueDateChanged(e: CustomEvent) {
    this.editedItem.due_date = e.detail.date;
  }

  isRequestInProcess(field: string, basePermissionPath: string, isRequestInProcess: boolean) {
    return !this.isReadOnly(field, basePermissionPath) && isRequestInProcess;
  }

  updateField(field: string, value: any): void {
    if (value === undefined) {
      return;
    }

    if (this.editedItem[field] === value) {
      return;
    }

    this.editedItem[field] = value;
    this.requestUpdate();
  }
}
