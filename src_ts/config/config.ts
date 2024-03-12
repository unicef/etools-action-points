import Dexie from 'dexie';
import endpoints from '../endpoints/endpoints';

declare global {
  interface Window {
    EtoolsApdApp: any;
    EtoolsRequestCacheDb: any;
    EtoolsEsmmFitIntoEl: any;
    EtoolsLanguage: any;
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
export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';
export const ROOT_PATH = '/' + getBasePath().replace(window.location.origin, '').slice(1, -1) + '/';
function getBasePath() {
  return document.getElementsByTagName('base')[0].href;
}
