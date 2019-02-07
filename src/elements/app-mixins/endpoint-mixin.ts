import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import * as config from '../core-elements/etools-app-config';
import * as _ from 'lodash';

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
      endpoint.url = config.baseSite + _.template(endpoint.template)(data);
    }
    debugger
    return _.clone(endpoint);
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
