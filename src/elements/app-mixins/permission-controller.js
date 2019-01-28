import '../common-elements/lodash.js';

let _permissionCollection = {};

window.APDMixins = window.APDMixins || {};
/*
 * Mixin for manage permission data.
 * @polymer
 * @mixinFunction
 */
window.APDMixins.PermissionController = superClass => class extends superClass {
  _addToCollection(collectionName, data) {
    // check arguments
    if (!collectionName || !data) {
      console.warn('collectionName and data arguments must be provided!');
      return false;
    }
    if (typeof collectionName !== 'string') {
      console.warn('collectionName must be a string');
      return false;
    }
    if (typeof data !== 'object' || typeof data.forEach === 'function') {
      console.warn('data must be an object');
      return false;
    }

    // check existence
    if (_permissionCollection[collectionName]) {
      return false;
    }

    _permissionCollection[collectionName] = data;
    this._manageActions(collectionName);

    return true;
  }

  _updateCollection(collectionName, data) {
    if (!_permissionCollection[collectionName]) {
      console.warn(`Collection ${collectionName} does not exist!`);
      return false;
    }
    if (typeof data !== 'object' || typeof data.forEach === 'function') {
      console.warn('data must be an object');
      return false;
    }

    _permissionCollection[collectionName] = data;
    this._manageActions(collectionName);
    return true;
  }

  _manageActions(collectionName) {
    let collection = _permissionCollection[collectionName];
    if (!collection) {
      console.warn(`Collection ${collectionName} does not exist!`);
      return false;
    }

    let allowedActions = collection.allowed_FSM_transitions || [];

    let actions = [];
    if (this.isValidCollection(collection.PUT)) {
      actions.push(this._createAction('save', allowedActions[0]));
    }
    if (this.isValidCollection(collection.POST)) {
      actions.push(this._createAction('create', allowedActions[0]));
    }

    collection.allowed_actions = actions.concat(allowedActions);
    return true;
  }

  _createAction(action, existedAction) {
    if (!existedAction || typeof existedAction === 'string') {
      return action;
    }
    return {
      code: action,
      display_name: action
    };
  }

  getFieldAttribute(path, attribute, actionType) {
    if (!path || !attribute) {
      throw new Error('path and attribute arguments must be provided');
    }
    if (typeof path !== 'string') {
      throw new Error('path argument must be a string');
    }
    if (typeof attribute !== 'string') {
      throw new Error('attribute argument must be a string');
    }

    let value = this._getCollection(path, actionType);

    if (value) {
      value = value[attribute];
    }

    return value === undefined ? null : value;

  }

  isReadonly(path) {
    return !this.collectionExists(path, 'POST') && !this.collectionExists(path, 'PUT');
  }

  isRequired(path) {
    return this.getFieldAttribute(path, 'required', 'POST') ||
      this.getFieldAttribute(path, 'required', 'PUT');
  }

  collectionExists(path, actionType) {
    if (!path) {
      throw new Error('path argument must be provided');
    }
    if (typeof path !== 'string') {
      throw new Error('path argument must be a string');
    }

    return !!this._getCollection(path, actionType);
  }

  getChoices(path) {
    return this.getFieldAttribute(path, 'choices', 'GET') ||
      this.getFieldAttribute(path, 'choices', 'POST');
  }

  _getCollection(path, actionType) {
    path = path.split('.');

    let value = _permissionCollection;

    while (path.length) {
      let key = path.shift();
      if (value[key]) {
        value = value[key];
      } else {
        let action = actionType ? value[actionType] : this.isValidCollection(value.POST) ||
          this.isValidCollection(value.PUT) ||
          this.isValidCollection(value.GET);

        value = action || value.child || value.children;
        path.unshift(key);
      }

      if (!value) {
        break;
      }
    }

    return value;
  }

  isValidCollection(collection) {
    if (collection && Object.keys(collection).length) {
      return collection;
    } else {
      return false;
    }
  }

  actionAllowed(collection, action) {
    if (!action || !collection) {
      return false;
    }
    if (typeof collection !== 'string') {
      throw new Error('collection argument must be a string');
    }
    if (typeof action !== 'string') {
      throw new Error('action argument must be a string');
    }
    collection = _permissionCollection[collection];

    let actions = collection && collection.allowed_actions;

    if (!actions || !actions.length) {
      return false;
    }
    if (typeof actions[0] !== 'string') {
      actions = actions.map(action => action.code);
    }

    return !!~actions.indexOf(action);
  }

  noActionsAllowed(collection) {
    if (!collection) {
      return true;
    }
    if (typeof collection !== 'string') {
      throw new Error('Collection argument must be a string');
    }
    collection = _permissionCollection[collection];

    return !(collection && collection.allowed_actions && collection.allowed_actions.length);
  }

  getActions(collection) {
    if (!collection) {
      return null;
    }
    if (typeof collection !== 'string') {
      throw new Error('Collection argument must be a string');
    }
    collection = _permissionCollection[collection];

    return collection && collection.allowed_actions || null;
  }
};
