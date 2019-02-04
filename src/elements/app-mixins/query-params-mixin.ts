import * as _ from 'lodash';

/*
 * Mixin for edit query string in location.
 * @polymer
 * @mixinFunction
 */
const QueryParams = (superClass: any) => class extends superClass {
  /**
   * Parse queries from location to JSON object
   * @returns {{Object}} of queries key-value
   */
  parseQueries() {
    let queriesObj: any = {};
    let queries = this.getQueriesString()
      .slice(1)
      .split('&');

    if (queries[0] === '') return {};
    queries.forEach((query: string) => {
      let [key, value] = query.split('=');
      queriesObj[key] = value || true;
    });

    return queriesObj;
  }

  /**
   * Get part of location by property
   * @param property
   * @returns {Window|Location|String|*|string}
   */
  getLocationProperty(property: string) {
    return window && window.location && window.location[property] || '';
  }

  /**
   * Get queries part of location
   * @returns {Window|Location|String|*|string}
   */
  getQueriesString() {
    return this.getLocationProperty('search');
  }

  /**
   * Get path part of location
   * @returns {string}
   */
  getPath() {
    let path = this.getLocationProperty('pathname');
    if (~path.indexOf('/apd')) {
      path = path.slice(4);
    }
    return path.slice(1);
  }

  /**
   * Update queries in location by new values
   * @param newQueries
   * @param path
   * @param noNotify
   * @returns {boolean}
   */
  updateQueries(newQueries: any, path: string, noNotify: boolean) {
    if (!_.isObject(newQueries)) {
      return false;
    }
    let keys = Object.keys(newQueries);

    if (!keys.length) {
      return false;
    }

    path = path && _.isString(path) ? path : this.getPath();
    let queries = this.parseQueries();

    keys.forEach((key) => {
      if (newQueries[key] === undefined || newQueries[key] === false) delete queries[key];
      else queries[key] = newQueries[key];
    });

    queries = Object.keys(queries).map((key) => {
      let value = typeof queries[key] === 'boolean' ? '' : `=${queries[key]}`;
      return `${key}${value}`;
    });

    try {
      window.history.replaceState({}, '', `${path}?${queries.join('&')}`);
    } catch (err) {
      console.warn(err);
    }

    if (!noNotify) {
      this.dispatchEvent(new CustomEvent('location-changed', {
        bubbles: true,
        composed: true
      }));
    }
    return true;
  }

  /**
   * Clear queries in location
   */
  clearQueries() {
    try {
      window.history.replaceState({}, '', this.getLocationProperty('pathname'));
    } catch (err) {
      console.warn(err);
    }
    this.dispatchEvent(new CustomEvent('location-changed', {
      bubbles: true,
      composed: true
    }));
  }
};

export default QueryParams;
