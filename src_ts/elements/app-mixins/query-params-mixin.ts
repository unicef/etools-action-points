import {basePath} from '../core-elements/etools-app-config';

export const parseQueries = () => {
  let queriesObj: any = {};
  let queries = getQueriesString()
      .slice(1)
      .split('&');

  if (queries[0] === '') return {};
  queries.forEach((query: string) => {
    let [key, value] = query.split('=');
    queriesObj[key] = value || true;
  });

  return queriesObj;
};

export const getLocationProperty = (property: string) => {
  // @ts-ignore
  return window && window.location && window.location[property] || '';
};

export const getQueriesString = () => {
  return getLocationProperty('search');
};

export const getPath = () => {
  let path = getLocationProperty('pathname');
  if (~path.indexOf('/apd')) {
    path = path.slice(4);
  }
  return path.slice(1);
};

export const updateQueries = (newQueries: any, path?: string, noNotify?: boolean) => {
  if (typeof newQueries != 'object') {
    return false;
  }
  let keys = Object.keys(newQueries);

  if (!keys.length) {
    return false;
  }

  path = path && typeof path === 'string' ? path : getPath();
  let queries = parseQueries();

  keys.forEach((key) => {
    if (newQueries[key] === undefined || newQueries[key] === false) delete queries[key];
    else queries[key] = newQueries[key];
  });

  queries = Object.keys(queries).map((key) => {
    let value = typeof queries[key] === 'boolean' ? '' : `=${queries[key]}`;
    return `${key}${value}`;
  });

  try {
    window.history.replaceState({}, '', `${basePath}${path}?${queries.join('&')}`);
  } catch (err) {
    console.warn(err);
  }

  if (!noNotify) {
    dispatchEvent(new CustomEvent('location-changed', {
      bubbles: true,
      composed: true
    }));
  }
  return true;
};

export const clearQueries = () => {
  try {
    window.history.replaceState({}, '', getLocationProperty('pathname'));
  } catch (err) {
    console.warn(err);
  }
  dispatchEvent(new CustomEvent('location-changed', {
    bubbles: true,
    composed: true
  }));
};
