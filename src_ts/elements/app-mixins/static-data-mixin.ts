let _staticData: any = {};

export const _setData = (key: string, data: any) => {
  if (!key || !data || _staticData[key]) {
    return false;
  }
  _staticData[key] = JSON.parse(JSON.stringify(data));
  return true;
};

export const getData = (key: string) => {
  if (!key || !_staticData[key]) {
    return;
  }
  return JSON.parse(JSON.stringify(_staticData[key]));
};
