const apdEndpoints = {
  userProfile: {
    url: '/api/v3/users/profile/'
  },
  changeCountry: {
    url: '/api/v3/users/changecountry/'
  },
  changeOrganization: {
    url: '/api/v3/users/changeorganization/'
  },
  partnerOrganisations: {
    url: '/api/pmp/v3/partners/?hidden=false',
    exp: 2 * 60 * 60 * 1000, // 2h
    cacheTableName: 'partners'
  },
  partnerOrganisationDetails: {
    template: (id: string) => `/api/v2/partners/${id}/`
  },
  interventionDetails: {
    template: (id: string) => `/api/v2/interventions/${id}/`
  },
  interventionsList: {
    template: '/api/v2/interventions/?verbosity=minimal'
  },
  cpOutputsV2: {
    template: (ids: string) => `/api/v2/reports/results/?values=${ids}`
  },
  cpOutputsList: {
    template: '/api/v2/reports/results/?verbosity=minimal'
  },
  actionPointsList: {
    url: '/api/action-points/action-points/'
  },
  actionPointsListExport: {
    url: '/api/action-points/action-points/export/xlsx'
  },
  actionPoint: {
    template: (id: string) => `/api/action-points/action-points/${id}/`
  },
  actionPointExport: {
    template: (id: string) => `/api/action-points/action-points/${id}/export/xlsx/`
  },
  actionPointComplete: {
    template: (id: string) => `/api/action-points/action-points/${id}/complete/`
  },
  locations: {
    url: '/api/locations-light/',
    exp: 25 * 60 * 60 * 1000, // 25h
    cacheTableName: 'locations'
  },
  sectionsCovered: {
    url: '/api/reports/sectors/',
    exp: 24 * 60 * 60 * 1000, // 24h
    cacheTableName: 'sections'
  },
  offices: {
    url: '/api/offices/',
    exp: 23 * 60 * 60 * 1000, // 23h
    cacheTableName: 'offices'
  },
  unicefUsers: {
    url: '/api/v3/users/',
    exp: 60 * 60 * 1000, // 1h
    cacheTableName: 'users'
  },
  categoriesList: {
    url: '/api/action-points/categories/',
    exp: 60 * 60 * 1000, // 1h
    cacheTableName: 'categories'
  },
  attachmentsUpload: {
    url: '/api/v2/attachments/upload/'
  }
};

export default apdEndpoints;
