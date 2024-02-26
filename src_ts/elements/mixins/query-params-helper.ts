import {basePath} from '../../config/config';

export const getLocationProperty = (property: string) => {
  // @ts-ignore
  return (window && window.location && window.location[property]) || '';
};

export const getQueriesString = () => {
  return getLocationProperty('search');
};
export const parseQueries = () => {
  const queriesObj: any = {};
  const queries = getQueriesString().slice(1).split('&');

  if (queries[0] === '') return {};
  queries.forEach((query: string) => {
    const [key, value] = query.split('=');
    queriesObj[key] = value || true;
  });

  return queriesObj;
};

export const getPath = () => {
  let path = getLocationProperty('pathname');
  if (~path.indexOf('/apd')) {
    path = path.slice(4);
  }
  return path.slice(1);
};

export const updateQueries = (element: HTMLElement, newQueries: any, path?: string, noNotify?: boolean) => {
  if (typeof newQueries != 'object' || !Object.keys(newQueries).length) {
    return false;
  }

  path = path && typeof path === 'string' ? path : getPath();

  newQueries = Object.keys(newQueries).map((key) => {
    const value = typeof newQueries[key] === 'boolean' || newQueries[key] === '' ? '' : `=${newQueries[key]}`;
    return `${key}${value}`;
  });

  try {
    window.history.replaceState({}, '', `${basePath}${path}?${newQueries.join('&')}`);
  } catch (err) {
    console.warn(err);
  }

  if (!noNotify) {
    element.dispatchEvent(
      new CustomEvent('location-changed', {
        bubbles: true,
        composed: true
      })
    );
  }
  return true;
};

export const clearQueries = () => {
  try {
    window.history.replaceState({}, '', getLocationProperty('pathname'));
  } catch (err) {
    console.warn(err);
  }
  dispatchEvent(
    new CustomEvent('location-changed', {
      bubbles: true,
      composed: true
    })
  );
};
