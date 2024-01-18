import {AnyObject} from '@unicef-polymer/etools-types/dist/global.types';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {EtoolsFilterTypes} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';

export enum APFilterKeys {
  search = 'search',
  assigned_to = 'assigned_to',
  assigned_by = 'assigned_by',
  partner = 'partner',
  office = 'office',
  location = 'location',
  section = 'section',
  related_module = 'related_module',
  status = 'status',
  high_priority = 'high_priority',
  intervention = 'intervention',
  cp_output = 'cp_output',
  due_date = 'due_date',
  due_date__lte = 'due_date__lte',
  due_date__gte = 'due_date__gte'
}

export const selectedValueTypeByFilterKey: AnyObject = {
  [APFilterKeys.search]: 'string',
  [APFilterKeys.assigned_to]: 'string',
  [APFilterKeys.assigned_by]: 'string',
  [APFilterKeys.partner]: 'string',
  [APFilterKeys.office]: 'string',
  [APFilterKeys.location]: 'string',
  [APFilterKeys.section]: 'string',
  [APFilterKeys.related_module]: 'string',
  [APFilterKeys.status]: 'string',
  [APFilterKeys.high_priority]: 'string',
  [APFilterKeys.intervention]: 'string',
  [APFilterKeys.cp_output]: 'string',
  [APFilterKeys.due_date]: 'string',
  [APFilterKeys.due_date__lte]: 'string',
  [APFilterKeys.due_date__gte]: 'string'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export function getAPFilters() {
  return [
    {
      filterName: 'Search',
      filterKey: APFilterKeys.search,
      type: EtoolsFilterTypes.Search,
      selectedValue: '',
      selected: true
    },
    {
      filterName: 'Assignee',
      filterKey: APFilterKeys.assigned_to,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Assigned By',
      filterKey: APFilterKeys.assigned_by,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Partner',
      filterKey: APFilterKeys.partner,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Office',
      filterKey: APFilterKeys.office,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Location',
      filterKey: APFilterKeys.location,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Section',
      filterKey: APFilterKeys.section,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Related App',
      filterKey: APFilterKeys.related_module,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'value',
      optionLabel: 'display_name',
      selectionOptions: [],
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'Status',
      filterKey: APFilterKeys.status,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'value',
      optionLabel: 'display_name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: true,
      minWidth: '200px',
      hideSearch: true,
      disabled: false
    },
    {
      filterName: 'High Priority',
      filterKey: APFilterKeys.high_priority,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'value',
      optionLabel: 'display_name',
      selectionOptions: [
        {
          display_name: 'Yes',
          value: 'true'
        },
        {
          display_name: 'No',
          value: 'false'
        }
      ],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: 'PD/SSFA',
      filterKey: APFilterKeys.intervention,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'title',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: true,
      disabled: false
    },
    {
      filterName: 'CP Output',
      filterKey: APFilterKeys.cp_output,
      type: EtoolsFilterTypes.Dropdown,
      optionValue: 'id',
      optionLabel: 'name',
      selectionOptions: [],
      singleSelection: true,
      selectedValue: null,
      selected: false,
      minWidth: '200px',
      hideSearch: true,
      disabled: false
    },

    {
      filterName: 'Due On',
      filterKey: APFilterKeys.due_date,
      type: EtoolsFilterTypes.Date,
      selectedValue: '',
      selected: false,
      disabled: false
    },
    {
      filterName: 'Due Before',
      filterKey: APFilterKeys.due_date__lte,
      type: EtoolsFilterTypes.Date,
      selectedValue: '',
      selected: false,
      disabled: false
    },
    {
      filterName: 'Due After',
      filterKey: APFilterKeys.due_date__gte,
      type: EtoolsFilterTypes.Date,
      selectedValue: '',
      selected: false,
      disabled: false
    }
  ];
}
