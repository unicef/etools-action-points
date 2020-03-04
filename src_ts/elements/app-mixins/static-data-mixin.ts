import {PolymerElement} from '@polymer/polymer';
import {Constructor} from '../../typings/globals.types';

let _staticData: any = {};
/*
 * Mixin for manage static data application.
 * @polymer
 * @mixinFunction
 */
export function StaticDataMixin<T extends Constructor<PolymerElement>>(superClass: T) {
  class StaticDataClass extends (superClass as Constructor<PolymerElement>) {
    public _setData(key: string, data: any) {
      if (!key || !data || _staticData[key]) {
        return false;
      }
      _staticData[key] = JSON.parse(JSON.stringify(data));
      return true;
    }

    public getData(key: string) {
      if (!key || !_staticData[key]) {
        return;
      }
      return JSON.parse(JSON.stringify(_staticData[key]));
    }

    public _updateData(key: string, data: any) {
      if (!key || !data || !_staticData[key]) {
        return false;
      }
      _staticData[key] = JSON.parse(JSON.stringify(data));
      return true;
    }
  }
  return StaticDataClass;
}
