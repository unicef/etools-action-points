// import '../common-elements/lodash';

let _user;
let _groups;

window.APDMixins = window.APDMixins || {};
/*
 * Mixin for manage user data.
 * @polymer
 * @mixinFunction
 */
window.APDMixins.UserController = superClass => class extends superClass {
  _setUserData(user) {
    if (_user) {
      throw new Error('User already exists!');
    }

    if (!user || !_.isObject(user) || _.isArray(user)) {
      throw new Error('User must be an object');
    }
    if (!user.id || !user.groups) {
      throw new Error('User must have id and groups fields!');
    }

    _user = _.cloneDeep(user);
    this._setGroups(user);
  }

  _setGroups(user) {
    if (!user.groups.length) {
      throw new Error('Can not find user group!');
    }
    _groups = user.groups.map((group) => {
      return group.name;
    });
  }

  getUserData() {
    return _.cloneDeep(_user);
  }

  isAuditor() {
    if (!_groups) {
      throw new Error('User data is missing or incorrect');
    }
    return !!~_groups.indexOf('Auditor');
  }
};