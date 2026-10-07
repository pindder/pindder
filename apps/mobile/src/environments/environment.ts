import { Capacitor } from '@capacitor/core';

const isAndroid = Capacitor.getPlatform() === 'android';
const baseHost = isAndroid ? '10.0.2.2' : 'localhost';

export const environment = {
  production: false,
  //liveApiUrl: 'https://pindder-api.onrender.com/api',
  apiUrl: `http://${baseHost}:4000/api`,
  //apiUrl: 'https://pindder-api.onrender.com/api',
  cloudName: 'w28vsff3',
  presetName: 'pindder'
};
