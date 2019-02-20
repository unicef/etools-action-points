import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import * as config from '../core-elements/etools-app-config';
// import * as _ from 'lodash';
// import cloneDeep from 'lodash/cloneDeep';

/**
 * App global configuration
 * @polymer
 * @mixinFunction
 */
const EndpointMixin = dedupingMixin((baseClass: any) => class extends baseClass {
  constructor() {
    super();
  }

  getEndpoint(endpointName: string, data?: object) {
    let endpoint = config.epsData[endpointName];
    if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
      endpoint.url = typeof endpoint.template === 'function' ? 
                      config.baseSite + endpoint.template(data) :
                      config.baseSite + endpoint.template
      
      // if (typeof endpoint.template === 'function') {
      //   endpoint.url = config.baseSite + endpoint.template(data);
      // } else {
      //   endpoint.url = config.baseSite + endpoint.template;
      // }
    }
    return JSON.parse(JSON.stringify(endpoint));
  }

  resetOldUserData() {
    console.log('resetOldUserData()');
    localStorage.removeItem('userId');
    config.appDexieDb.listsExpireMapTable.clear();
  }

  getAbsolutePath(path: string) {
    path = path || '';
    return config.basePath + path;
  }

  isProductionServer() {
    let location = window.location.href;
    return location.indexOf(config.productionDomain) > -1;
  }

  isStagingServer() {
    let location = window.location.href;
    return location.indexOf(config.stagingDomain) > -1;
  }
});

export default EndpointMixin;
