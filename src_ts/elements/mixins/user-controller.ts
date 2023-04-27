import {Constructor} from '../../typings/globals.types';
import {LitElement} from 'lit-element';

let _user: any;
let _groups: any;

export function UserControllerMixin<T extends Constructor<LitElement>>(superClass: T) {
  class UserControllerClass extends (superClass as Constructor<LitElement>) {
    _setUserData(user: any) {
      if (_user) {
        throw new Error('User already exists!');
      }

      if (!user || !(typeof user === 'object') || Array.isArray(user)) {
        throw new Error('User must be an object');
      }
      if (!user.user || !user.groups) {
        throw new Error('User must have id and groups fields!');
      }

      _user = JSON.parse(JSON.stringify(user));
      this._setGroups(user);
    }

    _setGroups(user: any) {
      if (!user.groups.length) {
        throw new Error('Can not find user group!');
      }
      _groups = user.groups.map((group: any) => {
        return group.name;
      });
    }

    getUserData() {
      return JSON.parse(JSON.stringify(_user));
    }

    isAuditor() {
      if (!_groups) {
        throw new Error('User data is missing or incorrect');
      }
      return !!~_groups.indexOf('Auditor');
    }
  }
  return UserControllerClass as (typeof UserControllerClass) & T;
}
