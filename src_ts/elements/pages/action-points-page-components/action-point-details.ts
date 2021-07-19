import {PolymerElement, html} from '@polymer/polymer';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin.js';
import '@unicef-polymer/etools-loading/etools-loading.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import {LocalizationMixin} from '../../app-mixins/localization-mixin';
import {InputAttrs} from '../../app-mixins/input-attrs-mixin';
import {getEndpoint} from '../../app-mixins/endpoint-mixin';
import {DateMixin} from '../../app-mixins/date-mixin';
import {getData} from '../../app-mixins/static-data-mixin';
import {isReadOnly, actionAllowed} from '../../app-mixins/permission-controller';
import {pageLayoutStyles} from '../../styles-elements/page-layout-styles';
import {sharedStyles} from '../../styles-elements/shared-styles';
import {tabInputsStyles} from '../../styles-elements/tab-inputs-styles';
import {moduleStyles} from '../../styles-elements/module-styles';
import {customElement, observe, property} from '@polymer/decorators';
import {GenericObject} from '../../../typings/globals.types';

@customElement('action-point-details')
export class ActionPointDetails extends
  EtoolsAjaxRequestMixin(
      InputAttrs(
          LocalizationMixin(
              DateMixin(PolymerElement)))) {
  static get template() {
    return html`
      ${pageLayoutStyles}
      ${sharedStyles}
      ${tabInputsStyles}
      ${moduleStyles}
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
          font-size: 12px;
          color: var(--list-secondary-text-color, #757575);
        }

        .last-modify__author {
          font-weight: bold;
        }

        .reference-link {
          @apply --layout-vertical;
          padding: 8px 12px;
          position: relative;
        }

        .reference-link>label {
          font-size: 16px;
          width: 133%;
          transform: scale(0.75);
          transform-origin: left top;
          color: var(--paper-input-container-color, var(--secondary-text-color));
        }

        .reference-link>a {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--module-primary);
          font-weight: 500;
        }

        .reference-link>span {
          font-size: 16px;
          line-height: 16px;
          color: var(--paper-input-container-color, var(--gray-20));
        }
      </style>

      <etools-content-panel class="content-section clearfix" panel-title="Action Points Details">
        <template is="dom-if" if="[[!actionAllowed(permissionPath, 'create')]]">
          <div class="row-h group">
            <div class="input-container">
              <etools-dropdown class$="validate-input disabled-as-readonly readonly
                without-border [[_setRequired('related_module', permissionPath)]]"
                selected="{{editedItem.related_module}}" label="[[getLabel('related_module', permissionPath)]]"
                placeholder="-" options="[[modules]]" option-label="display_name" option-value="value"
                required$="[[_setRequired('related_module', permissionPath)]]"
                disabled$="[[isReadOnly('related_module', permissionPath)]]"
                readonly$="[[isReadOnly('related_module', permissionPath)]]"
                allow-outside-scroll dynamic-align>
              </etools-dropdown>
            </div>
            <div class="input-container">
              <div class="reference-link">
                <label>[[getLabel('related_object_str', permissionPath)]]</label>
                <a hidden$="[[!editedItem.related_object_url]]" target="_blank"
                   href$="[[editedItem.related_object_url]]">
                  [[editedItem.related_object_str]]
                </a>
                <span hidden$="[[editedItem.related_object_url]]">[[getPlaceholderText('related_object_str',
                  permissionPath, 'true')]]</span>
              </div>
            </div>
            <div class="input-container">
              <etools-dropdown
                class$="validate-input disabled-as-readonly [[_setRequired('assigned_by', permissionPath)]]"
                selected="{{editedItem.assigned_by}}" label="[[getLabel('assigned_by', permissionPath)]]"
                placeholder="-"
                options="[[unicefUsers]]" option-label="name" option-value="id"
                required$="[[_setRequired('assigned_by', permissionPath)]]"
                disabled$="[[isReadOnly('assigned_by', permissionPath)]]"
                readonly$="[[isReadOnly('assigned_by', permissionPath)]]"
                invalid="{{errors.assigned_by}}" error-message="{{errors.assigned_by}}" on-focus="_resetFieldError"
                on-tap="_resetFieldError" allow-outside-scroll dynamic-align>
              </etools-dropdown>
            </div>
          </div>
        </template>

        <div class="row-h group">
          <template is="dom-if" if="[[showCategory(categories)]]">
            <div class="input-container input-container-l">
              <!-- Category -->
              <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('category', permissionPath)]]"
                selected="{{editedItem.category}}" label="[[getLabel('category', permissionPath)]]"
                placeholder="[[getPlaceholderText('category', permissionPath, 'true')]]"
                options="[[categories]]" option-label="description" option-value="id"
                required$="[[_setRequired('category', permissionPath)]]"
                disabled$="[[isReadOnly('category', permissionPath)]]"
                readonly$="[[isReadOnly('category', permissionPath)]]"
                invalid="{{errors.category}}" error-message="{{errors.category}}" on-focus="_resetFieldError"
                on-tap="_resetFieldError" allow-outside-scroll dynamic-align>
              </etools-dropdown>
            </div>
          </template>

        </div>

        <div class="row-h group">
          <div class="input-container input-container-ms">
            <!-- Implementing Partner -->
            <template is="dom-if" if="[[!isReadOnly('partner', permissionPath)]]">
                <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('partner', permissionPath)]]"
                  selected="{{editedItem.partner}}" label="[[getLabel('partner', permissionPath)]]"
                  placeholder="[[getPlaceholderText('partner', permissionPath, 'true')]]"
                  options="[[partners]]" option-label="name" option-value="id"
                  required$="[[_setRequired('partner', permissionPath)]]"
                  invalid="{{errors.partner}}" error-message="{{errors.partner}}"
                  on-focus="_resetFieldError" on-tap="_resetFieldError"
                  allow-outside-scroll dynamic-align>
                </etools-dropdown>
                <etools-loading active="{{partnerRequestInProcess}}" no-overlay loading-text="" class="loading">
                </etools-loading>
              </template>
              <template is="dom-if" if="[[isReadOnly('partner', permissionPath)]]">
                <paper-input
                  label="[[getLabel('partner', permissionPath)]]"
                  placeholder="[[getPlaceholderText('partner', permissionPath, 'true')]]"
                  value="[[getStringValueOrEmpty(originalActionPoint.partner.name)]]"
                  readonly
                ></paper-input>
            </template>
          </div>
          <div class="input-container input-container-ms">
            <!-- PD/SSFA -->
            <template is="dom-if" if="[[!isReadOnly('intervention', permissionPath)]]">
              <etools-dropdown
                class$="validate-input disabled-as-readonly [[_setRequired('intervention', permissionPath)]]"
                selected="{{editedItem.intervention}}" label="[[getLabel('intervention', permissionPath)]]"
                placeholder="[[getPlaceholderText('intervention', permissionPath, 'true')]]"
                options="[[interventions]]" option-label="title" option-value="id"
                required$="[[_setRequired('intervention', permissionPath)]]"
                invalid="{{errors.intervention}}" error-message="{{errors.intervention}}"
                on-focus="_resetFieldError"
                on-tap="_resetFieldError" allow-outside-scroll dynamic-align>
              </etools-dropdown>
              <etools-loading active="{{interventionRequestInProcess}}" no-overlay loading-text="" class="loading">
              </etools-loading>
            </template>
            <template is="dom-if" if="[[isReadOnly('intervention', permissionPath)]]">
              <paper-input
                label="[[getLabel('intervention', permissionPath)]]"
                placeholder="[[getPlaceholderText('intervention', permissionPath, 'true')]]"
                value="[[getStringValueOrEmpty(originalActionPoint.intervention.title)]]"
                readonly
              ></paper-input>
            </template>
          </div>
        </div>


        <div class="row-h group">
          <div class="input-container input-container-ms">
            <!-- CP Output -->
            <template is="dom-if" if="[[!isReadOnly('cp_output', permissionPath)]]">
              <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('cp_output', permissionPath)]]"
                selected="{{editedItem.cp_output}}" label="[[getLabel('cp_output', permissionPath)]]"
                placeholder="[[getPlaceholderText('cp_output', permissionPath, 'true')]]"
                options="[[cpOutputs]]" option-label="name" option-value="id"
                required$="[[_setRequired('cp_output', permissionPath)]]"
                invalid="{{errors.cp_output}}" error-message="{{errors.cp_output}}"
                on-focus="_resetFieldError" on-tap="_resetFieldError"
                allow-outside-scroll dynamic-align>
              </etools-dropdown>
            </template>
            <template is="dom-if" if="[[isReadOnly('cp_output', permissionPath)]]">
              <paper-input
                label="[[getLabel('cp_output', permissionPath)]]"
                placeholder="[[getPlaceholderText('cp_output', permissionPath, 'true')]]"
                value="[[getStringValueOrEmpty(originalActionPoint.cp_output.name)]]"
                readonly
              ></paper-input>
            </template>
          </div>

          <div class="input-container input-container-ms">
            <!-- Locations -->
            <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('location', permissionPath)]]"
              selected="{{editedItem.location}}" label="[[getLabel('location', permissionPath)]]"
              placeholder="[[getPlaceholderText('location', permissionPath, 'true')]]"
              options="[[locations]]" option-label="name" option-value="id"
              required$="[[_setRequired('location', permissionPath)]]"
              disabled$="[[isReadOnly('location', permissionPath)]]"
              readonly$="[[isReadOnly('location', permissionPath)]]"
              invalid="{{errors.location}}" error-message="{{errors.location}}"
              on-focus="_resetFieldError" on-tap="_resetFieldError"
              allow-outside-scroll dynamic-align>
            </etools-dropdown>
          </div>
        </div>


        <div class="row-h group">
          <div class="input-container input-container-l">
            <!-- Description -->
            <paper-input class$="validate-input disabled-as-readonly [[_setRequired('description', permissionPath)]]"
              value="{{editedItem.description}}" label="[[getLabel('description', permissionPath)]]"
              placeholder="[[getPlaceholderText('description', permissionPath)]]"
              required$="[[_setRequired('description', permissionPath)]]"
              disabled$="[[isReadOnly('description', permissionPath)]]"
              readonly$="[[isReadOnly('description', permissionPath)]]" max-length="800"
              invalid$="{{errors.description}}"
              error-message="{{errors.description}}" on-focus="_resetFieldError"
              on-tap="_resetFieldError" no-title-attr>
            </paper-input>
          </div>
        </div>


        <div class="row-h group">
          <div class="input-container">
            <!-- Assigned To -->
            <etools-dropdown
              class$="validate-input disabled-as-readonly [[_setRequired('assigned_to', permissionPath)]]"
              selected="{{editedItem.assigned_to}}" label="[[getLabel('assigned_to', permissionPath)]]"
              placeholder="[[getPlaceholderText('assigned_to', permissionPath, 'true')]]"
              options="[[unicefUsers]]" option-label="name" option-value="id"
              required$="[[_setRequired('assigned_to', permissionPath)]]"
              disabled$="[[isReadOnly('assigned_to', permissionPath)]]"
              readonly$="[[isReadOnly('assigned_to', permissionPath)]]"
              invalid="{{errors.assigned_to}}" error-message="{{errors.assigned_to}}"
              on-focus="_resetFieldError" on-tap="_resetFieldError"
              allow-outside-scroll dynamic-align>
            </etools-dropdown>
          </div>
          <div class="input-container">
            <!-- Section -->
            <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('section', permissionPath)]]"
              selected="{{editedItem.section}}" label="[[getLabel('section', permissionPath)]]"
              placeholder="[[getPlaceholderText('section', permissionPath, 'true')]]"
              options="[[sectionsCovered]]" option-label="name" option-value="id"
              required$="[[_setRequired('section', permissionPath)]]"
              disabled$="[[isReadOnly('section', permissionPath)]]"
              readonly$="[[isReadOnly('section', permissionPath)]]"
              invalid="{{errors.section}}" error-message="{{errors.section}}"
              on-focus="_resetFieldError" on-tap="_resetFieldError"
              allow-outside-scroll dynamic-align>
            </etools-dropdown>
          </div>
          <div class="input-container">
            <!-- Office -->
            <etools-dropdown class$="validate-input disabled-as-readonly [[_setRequired('office', permissionPath)]]"
              selected="{{editedItem.office}}" label="[[getLabel('office', permissionPath)]]"
              placeholder="[[getPlaceholderText('office', permissionPath, 'true')]]"
              options="[[offices]]" option-label="name" option-value="id" update-selected
              required$="[[_setRequired('office', permissionPath)]]"
              disabled$="[[isReadOnly('office', permissionPath)]]"
              readonly$="[[isReadOnly('office', permissionPath)]]"
              invalid="{{errors.office}}" error-message="{{errors.office}}"
              on-focus="_resetFieldError" on-tap="_resetFieldError"
              allow-outside-scroll dynamic-align>
            </etools-dropdown>
          </div>
        </div>

        <div class="row-h group">
          <div class="input-container input-checkbox-container">
            <!-- Priority -->
            <paper-checkbox checked="{{editedItem.high_priority}}"
              disabled$="[[isReadOnly('high_priority', permissionPath)]]">
              [[getLabel('high_priority', permissionPath)]]</paper-checkbox>
          </div>
          <div class="input-container">
            <!-- Due Date -->
            <datepicker-lite id="dueDate"
                             class$="[[_setRequired('due_date', permissionPath)]]"
                             label$="[[getLabel('due_date', permissionPath)]]"
                             modal$="[[datepickerModal]]"
                             placeholder$="[[getPlaceholderText('due_date', permissionPath, 'datepicker')]]"
                             slot="prefix"
                             selected-date-display-format="YYYY-MM-DD"
                             clear-btn-inside-dr
                             required$="[[_setRequired('due_date', permissionPath)]]"
                             disabled$="[[isReadOnly('due_date', permissionPath)]]"
                             error-message$="{{errors.due_date}}"
                             value="{{editedItem.due_date}}">
            </datepicker-lite>
          </div>
        </div>
        <template is="dom-if" if="[[editedItem.history.0]]">
          <div class="last-modify">
            Last modify by
            <span class="last-modify__author">[[editedItem.history.0.by_user_display]]</span>
            [[formatDateInLocal(editedItem.history.0.created, 'D MMM YYYY h:mm A')]]
          </div>
        </template>
      </etools-content-panel>
    `;
  }

  @property({type: Array, notify: true})
  partners: object[] = [];

  @property({type: String, notify: true})
  permissionPath: string;

  @property({type: Array})
  locations: object[] = [];

  @property({type: Object, notify: true})
  editedItem: GenericObject = {};

  @property({type: Array, notify: true})
  cpOutputs: object[];

  @property({type: Array, notify: true})
  interventions: object[] = [];

  @property({type: Array, notify: true})
  modules: object[]

  @property({type: Array, notify: true})
  unicefUsers: object[];

  @property({type: Array, notify: true})
  offices: object[];

  @property({type: Array, notify: true})
  sectionsCovered: object[];

  @property({type: Object, notify: true})
  originalActionPoint: GenericObject;

  @property({type: Boolean})
  dataIsSet: boolean = false;

  @property({type: Boolean})
  partnerRequestInProcess: boolean;

  @property({type: Number})
  lastPartnerId: number;

  @observe('permissionPath')
  _updateStyles() {
    this.updateStyles();
  }

  @observe('editedItem')
  _setDrDOptions(editedItem: any) {
    let module = editedItem && editedItem.related_module;
    let categories = [];

    if (module) {
      let categoriesList = getData('categoriesList');
      categories = categoriesList.filter((category: any) => category.module === module);
    }

    this.set('categories', categories);
  }

  ready() {
    super.ready();
    document.addEventListener('static-data-loaded', () => this.setData());
    document.addEventListener('locations-loaded', () => this._updateLocations());
    this.addEventListener('reset-validation', ({detail}: any) => {
      let elements: NodeList = this.shadowRoot.querySelectorAll('.validate-input');
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

  setData() {
    this.set('modules', getData('modules'));
    this.set('partners', getData('partnerOrganisations'));
    this.set('offices', getData('offices'));
    this.set('sectionsCovered', getData('sectionsCovered'));
    this.set('cpOutputs', getData('cpOutputsList'));
    this.set('unicefUsers', (getData('unicefUsers') || []).map((user: any) => {
      return {id: user.id, name: user.name};
    }));

    this._updateLocations();
    this.set('dataIsSet', true);
  }

  @observe('actionPoint')
  _updateEditedItem(actionPoint: any) {
    this.set('editedItem', actionPoint && JSON.parse(JSON.stringify(actionPoint)) || {});
  }

  _updateLocations(filter?: any) {
    let locations = getData('locations') || [];
    this.set('locations', locations.filter((location: any) => {
      return !filter || !!~filter.indexOf(+location.id);
    }));
  }

  @observe('editedItem.partner')
  _requestPartner(partnerId: number) {
    if (this.partnerRequestInProcess || this.lastPartnerId === partnerId) {
      return;
    }
    this.set('lastPartnerId', partnerId);

    if (!partnerId && partnerId !== 0) {
      return;
    }

    this.set('partnerRequestInProcess', true);
    this.set('partner', null);
    if (this.originalActionPoint) {
      let originalPartner = this.originalActionPoint.partner ? this.originalActionPoint.partner.id : null;
      let originalIntervention = this.originalActionPoint.intervention ?
        this.originalActionPoint.intervention.id : null;
      if (partnerId !== originalPartner || this.editedItem.intervention !== originalIntervention) {
        this.set('editedItem.intervention', null);
      }
    }

    let endpoint = getEndpoint('partnerOrganisationDetails', partnerId);
    this.sendRequest({
      method: 'GET',
      endpoint
    })
        .then((data: any) => {
          this.set('partner', data || null);
          this.set('partnerRequestInProcess', false);
        }).catch(() => {
          console.error('Can not load partner data');
          this.set('partnerRequestInProcess', false);
        });
  }

  @observe('editedItem.intervention')
  async _updateCpOutputs(interventionId: number) {
    if (interventionId === undefined) {
      return;
    }
    this._checkAndResetData(interventionId);
    if (interventionId === null) {
      this.set('cpOutputs', getData('cpOutputsList'));
      this._updateLocations();
      return;
    }
    try {
      this.set('interventionRequestInProcess', true);
      this.set('cpOutputs', undefined);
      let interventionEndpoint = getEndpoint('interventionDetails', interventionId);
      let intervention = await this.sendRequest({
        method: 'GET',
        endpoint: interventionEndpoint
      });

      let locations = intervention && intervention.flat_locations || [];
      this._updateLocations(locations);

      let resultLinks = intervention && intervention.result_links;
      if (!Array.isArray(resultLinks)) {
        this._finishCpoRequest();
        return;
      }

      let cpIds: string[] = [];
      resultLinks.forEach((link) => {
        if (link && (link.cp_output || link.cp_output === 0)) {
          cpIds.push(link.cp_output);
        }
      });

      if (!cpIds.length) {
        this._finishCpoRequest();
        return;
      }

      let endpoint = getEndpoint('cpOutputsV2', cpIds.join(','));
      this.set('cpOutputs', await this.sendRequest({
        method: 'GET',
        endpoint: endpoint
      }) || []);
      this.set('interventionRequestInProcess', false);
    } catch (error) {
      console.error('Can not load cpOutputs data');
      this._finishCpoRequest();
    }
  }
  /* jshint ignore:end */

  _checkAndResetData(intervention: any) {
    if (!this.originalActionPoint) {return;}
    let originalIntervention = this.originalActionPoint.intervention ? this.originalActionPoint.intervention.id : null;
    let originalOutput = this.originalActionPoint.cp_output ? this.originalActionPoint.cp_output.id : null;
    let originalLocation = this.originalActionPoint.location ? this.originalActionPoint.location.id : null;
    let currentOutput = this.editedItem.cp_output;
    let currentLocation = this.editedItem.location;

    let interventionChanged = originalIntervention !== intervention;
    if (interventionChanged || originalOutput !== currentOutput) {
      this.set('editedItem.cp_output', null);
    }
    if (interventionChanged || originalLocation !== currentLocation) {
      this.set('editedItem.location', null);
    }
  }

  _finishCpoRequest() {
    this.set('cpOutputs', []);
    this.set('interventionRequestInProcess', false);
  }

  @observe('originalActionPoint.intervention, originalActionPoint.partner.id, partner')
  _updateInterventions(intervention: any, originalId: number, partner: any) {
    let interventions = partner && partner.interventions || [];
    let id = partner && partner.id;
    let exists = intervention && interventions.find((item: any) => {
      return item.id === intervention.id;
    });

    if (intervention && id === originalId && !exists) {
      interventions.push(intervention);
    }

    this.set('interventions', interventions);
  }

  validate() {
    let elements: NodeList = this.shadowRoot.querySelectorAll('.validate-input');
    let valid = true;
    elements.forEach((element: GenericObject) => {
      if (element.required && !element.disabled && !element.validate()) {
        let label = element.label || 'Field';
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
}
