import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
// import 'etools-dexiejs.html'
import '../common-elements/lodash.js';

window.APDMixins = window.APDMixins || {};
/**
 * App global configuration
 * @polymer
 * @mixinFunction
 */
APDMixins.AppConfig = dedupingMixin(baseClass => class extends baseClass {
  constructor() {
    super();

    let etoolsCustomDexieDb = new Dexie('APD');
    etoolsCustomDexieDb.version(1).stores({
      listsExpireMapTable: '&name, expire',
      partners: 'id',
      sections: 'id',
      offices: 'id',
      locations: 'id',
      users: 'id',
      categories: 'id'
    });
    window.EtoolsRequestCacheDb = etoolsCustomDexieDb;

    const endpoints = {
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

    this.baseSite = window.location.origin;
    this.serverBackend = (window.location.port !== '8080');
    this.basePath = this.serverBackend ? '/apd/' : '/';
    // this.epsData = this.serverBackend ? endpoints : localEndpoints;
    this.epsData = endpoints;
    // dexie js
    this.appDexieDb = etoolsCustomDexieDb;
    this.stagingDomain = 'etools-staging.unicef.org';
    this.productionDomain = 'etools.unicef.org';

  }

  getEndpoint(endpointName, data) {
    let endpoint = this.epsData[endpointName];
    if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
      endpoint.url = this.baseSite + _.template(endpoint.template)(data);
    }
    return _.clone(endpoint);
  }

  resetOldUserData() {
    console.log('resetOldUserData()');
    localStorage.removeItem('userId');
    this.appDexieDb.listsExpireMapTable.clear();
  }

  getAbsolutePath(path) {
    path = path || '';
    return this.basePath + path;
  }

  isProductionServer() {
    let location = window.location.href;
    return location.indexOf(this.productionDomain) > -1;
  }

  isStagingServer() {
    let location = window.location.href;
    return location.indexOf(this.stagingDomain) > -1;
  }
});
