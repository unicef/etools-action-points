import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';
import * as config from '../core-elements/etools-app-config';

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
                      config.baseSite + endpoint.template;
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

  _checkEnvironment() {
    let location = window.location.href;
    if (location.indexOf(config.stagingDomain) > -1) {
      return 'STAGING';
    }
    if (location.indexOf(config.demoDomain) > -1) {
      return 'DEMO';
    }
    if (location.indexOf(config.devDomain) > -1) {
      return 'DEVELOPMENT';
    }
    if (location.indexOf(config.localDomain) > -1) {
      return 'LOCAL';
    }
    return null;
  }
});

export default EndpointMixin;
