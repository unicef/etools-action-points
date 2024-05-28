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

export const epsData: any = endpoints;
// dexie js
export const appDexieDb = window.EtoolsApdApp.etoolsCustomDexieDb;
export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';