import {GenericObject} from '../../typings/globals.types';

export const _permissionCollection: GenericObject = {};

export const _addToCollection = (collectionName: string, data: any) => {
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
  _manageActions(collectionName);

  dispatchEvent(new CustomEvent('permissions-loaded', {bubbles: true, composed: true}));

  return true;
};

export const _updateCollection = (collectionName: string, data: any) => {
  if (!_permissionCollection[collectionName]) {
    console.warn(`Collection ${collectionName} does not exist!`);
    return false;
  }
  if (typeof data !== 'object' || typeof data.forEach === 'function') {
    console.warn('data must be an object');
    return false;
  }

  _permissionCollection[collectionName] = data;
  _manageActions(collectionName);
  return true;
};

export const _manageActions = (collectionName: string) => {
  let collection = _permissionCollection[collectionName];
  if (!collection) {
    console.warn(`Collection ${collectionName} does not exist!`);
    return false;
  }

  let allowedActions = collection.allowed_FSM_transitions || [];

  let actions = [];
  if (isValidCollection(collection.PUT)) {
    actions.push(_createAction('save', allowedActions[0]));
  }
  if (isValidCollection(collection.POST)) {
    actions.push(_createAction('create', allowedActions[0]));
  }

  collection.allowed_actions = actions.concat(allowedActions);
  return true;
};

export const _createAction = (action: string, existedAction: any) => {
  if (!existedAction || typeof existedAction === 'string') {
    return action;
  }
  return {
    code: action,
    display_name: action
  };
};

export const getFieldAttribute = (path: string, attribute: string, actionType?: string | undefined) => {
  if (!path || !attribute) {
    throw new Error('path and attribute arguments must be provided');
  }
  if (typeof path !== 'string') {
    throw new Error('path argument must be a string');
  }
  if (typeof attribute !== 'string') {
    throw new Error('attribute argument must be a string');
  }
  let value: any = _getCollection(path, actionType);

  if (value) {
    value = value[attribute];
  }

  return value === undefined ? null : value;
};

export const isReadOnly = (path: string) => {
  return !collectionExists(path, 'POST') && !collectionExists(path, 'PUT');
};

export const isRequired = (path: string) => {
  return getFieldAttribute(path, 'required', 'POST') ||
    getFieldAttribute(path, 'required', 'PUT');
};

export const collectionExists = (path: string, actionType?: string) => {
  if (!path) {
    throw new Error('path argument must be provided');
  }
  if (typeof path !== 'string') {
    throw new Error('path argument must be a string');
  }

  return !!_getCollection(path, actionType);
};

export const getChoices = (path: string) => {
  return getFieldAttribute(path, 'choices', 'GET') ||
    getFieldAttribute(path, 'choices', 'POST');
};

export const _getCollection = (path: any, actionType: string | undefined) => {
  path = path.split('.');

  let value: any = _permissionCollection;

  while (path.length) {
    let key = path.shift();
    if (value[key]) {
      value = value[key];
    } else {
      let action = actionType ? value[actionType] : isValidCollection(value.POST) ||
        isValidCollection(value.PUT) ||
        isValidCollection(value.GET);

      value = action || value.child || value.children;
      path.unshift(key);
    }

    if (!value) {
      break;
    }
  }

  return value;
};

export const isValidCollection = (collection: string) => {
  if (collection && Object.keys(collection).length) {
    return collection;
  } else {
    return false;
  }
};

export const actionAllowed = (collection: any, action: string) => {
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
    actions = actions.map((action: any) => action.code);
  }

  return !!~actions.indexOf(action);
};

export const noActionsAllowed = (coll: string) => {
  if (!coll) {
    return true;
  }
  if (typeof coll !== 'string') {
    throw new Error('Collection argument must be a string');
  }
  let collection = _permissionCollection[coll];

  return !(collection && collection.allowed_actions && collection.allowed_actions.length);
};

export const getActions = (coll: string) => {
  if (!coll) {
    return null;
  }
  if (typeof coll !== 'string') {
    throw new Error('Collection argument must be a string');
  }
  let collection = _permissionCollection[coll];

  return collection && collection.allowed_actions || null;
};
