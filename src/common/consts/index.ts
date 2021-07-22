export const emailRegex = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]' +
  '{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
export const passRegex = new RegExp('[a-zA-z 0-9]{8,}');
export const inputsRegex = new RegExp('^[?!,.а-яА-ЯёЁ0-9\\sa-zA-Z"№;%:*()_"\'+//-]+$');
export const parseHTMLRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/gm;

export const PERSISTENCE_NAV_KEY = 'NAVIGATION_STATE';

export const googleOAuthClientId = '383429019755-1g1ffu4bhcr1nm3tdp0ojbenr3ifprej.apps.googleusercontent.com';
