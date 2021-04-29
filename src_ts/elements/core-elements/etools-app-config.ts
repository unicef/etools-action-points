import Dexie from 'dexie';
import endpoints from '../app-mixins/endpoints';

declare global {
  interface Window {
    EtoolsApdApp: any;
    EtoolsRequestCacheDb: any;
    EtoolsEsmmFitIntoEl: any;
  }
}

window.EtoolsApdApp = window.EtoolsApdApp || {};

window.EtoolsApdApp.etoolsCustomDexieDb = new Dexie('APD');
window.EtoolsApdApp.etoolsCustomDexieDb.version(1).stores({
  listsExpireMapTable: '&name, expire',
  partners: 'id',
  sections: 'id',
  offices: 'id',
  locations: 'id',
  users: 'id',
  categories: 'id'
});
window.EtoolsRequestCacheDb = window.EtoolsRequestCacheDb || window.EtoolsApdApp.etoolsCustomDexieDb;

export const baseSite = window.location.origin;
export const basePath = '/apd/';
export const epsData: any = endpoints;
// dexie js
export const appDexieDb = window.EtoolsApdApp.etoolsCustomDexieDb;
export const stagingDomain = 'etools-staging.unicef.org';
export const productionDomain = 'etools.unicef.org';
export const demoDomain = 'etools-demo.unicef.org';
export const devDomain = 'etools-dev.unicef.org';
export const localDomain = 'localhost';
