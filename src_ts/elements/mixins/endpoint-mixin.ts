// import {PolymerElement} from '@polymer/polymer';
// import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
import * as config from '../app-shell/etools-app-config';
// import {Constructor} from '../../typings/globals.types';

/**
 * App global configuration
 * @polymer
 * @mixinFunction
 */
// export function EndpointMixin<T extends Constructor<PolymerElement>>(superClass: T) {
// class EndpointMixinClass extends (superClass as Constructor<PolymerElement>) {
export const getEndpoint = (endpointName: string, data?: any) => {
  const endpoint = config.epsData[endpointName];
  // eslint-disable-next-line no-prototype-builtins
  if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
    endpoint.url =
      typeof endpoint.template === 'function'
        ? config.baseSite + endpoint.template(data)
        : config.baseSite + endpoint.template;
  }
  return JSON.parse(JSON.stringify(endpoint));
};

export const resetOldUserData = () => {
  console.log('resetOldUserData()');
  localStorage.removeItem('userId');
  config.appDexieDb.listsExpireMapTable.clear();
};

export const getAbsolutePath = (path: string) => {
  path = path || '';
  return config.basePath + path;
};

export const _checkEnvironment = () => {
  const location = window.location.href;
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
};
// }
// return EndpointMixinClass;
// };

// export const EndpointMixin = dedupingMixin(mixin);
