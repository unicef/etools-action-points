import {PolymerElement} from '@polymer/polymer';
import {basePath} from '../core-elements/etools-app-config';
import {Constructor} from '../../typings/globals.types';

/*
 * Mixin for edit query string in location.
 * @polymer
 * @mixinFunction
 */
export function QueryParams<T extends Constructor<PolymerElement>>(superClass: T) {
  class QueryParamsClass extends (superClass as Constructor<PolymerElement>) {
    /**
     * Parse queries from location to JSON object
     * @returns {{Object}} of queries key-value
     */
    private parseQueries() {
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
    protected getLocationProperty(property: string) {
      // @ts-ignore
      return window && window.location && window.location[property] || '';
    }

    /**
     * Get queries part of location
     * @returns {Window|Location|String|*|string}
     */
    protected getQueriesString() {
      return this.getLocationProperty('search');
    }

    /**
     * Get path part of location
     * @returns {string}
     */
    protected getPath() {
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
    public updateQueries(newQueries: any, path?: string, noNotify?: boolean) {
      if (typeof newQueries != 'object') {
        return false;
      }
      let keys = Object.keys(newQueries);

      if (!keys.length) {
        return false;
      }

      path = path && typeof path === 'string' ? path : this.getPath();
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
        window.history.replaceState({}, '', `${basePath}${path}?${queries.join('&')}`);
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
    protected clearQueries() {
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
  }
  return QueryParamsClass;
}
