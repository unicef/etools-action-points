import * as config from '../config/config';

/**
 * App global configuration
 * @mixinFunction
 */

export const getEndpoint = (endpointName: string, data?: any) => {
  const endpoint = config.epsData[endpointName];
  // eslint-disable-next-line no-prototype-builtins
  if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
    endpoint.url =
      typeof endpoint.template === 'function'
        ? window.location.origin + endpoint.template(data)
        : window.location.origin + endpoint.template;
  }
  return JSON.parse(JSON.stringify(endpoint));
};

export const resetOldUserData = () => {
  localStorage.removeItem('userId');
  config.appDexieDb.listsExpireMapTable.clear();
};
