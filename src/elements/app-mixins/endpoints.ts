const apdEndpoints = {
  userProfile: {
    url: '/users/api/profile/'
  },
  changeCountry: {
    url: '/users/api/changecountry/'
  },
  partnerOrganisations: {
    url: '/api/v2/partners/?hidden=false',
    exp: 2 * 60 * 60 * 1000, // 2h
    cacheTableName: 'partners'
  },
  partnerOrganisationDetails: {
    template: '/api/v2/partners/<%=id%>/'
  },
  interventionDetails: {
    template: '/api/v2/interventions/<%=id%>/'
  },
  interventionsList: {
    template: '/api/v2/interventions/'
  },
  cpOutputsV2: {
    template: '/api/v2/reports/results/?values=<%=ids%>'
  },
  cpOutputsList: {
    template: '/api/v2/reports/results/?verbosity=minimal'
  },
  actionPointsList: {
    url: '/api/action-points/action-points/'
  },
  actionPointsListExport: {
    url: '/api/action-points/action-points/export/csv/'
  },
  actionPoint: {
    template: '/api/action-points/action-points/<%=id%>/'
  },
  actionPointExport: {
    template: '/api/action-points/action-points/<%=id%>/export/csv/'
  },
  actionPointComplete: {
    template: '/api/action-points/action-points/<%=id%>/complete/'
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
    url: '/api/users/',
    exp: 60 * 60 * 1000, // 1h
    cacheTableName: 'users'
  },
  categoriesList: {
    url: '/api/action-points/categories/',
    exp: 60 * 60 * 1000, // 1h
    cacheTableName: 'categories'
  }
};

export default apdEndpoints;
