import { Capacitor } from '@capacitor/core';

export const localUri = 'http://localhost:4000/api';
export const serverUri = 'https://pindder-api.onrender.com/api';

// Define a proper full base URL depending on environment
export const getApiUrl = () => {
  const isNative = Capacitor.isNativePlatform(); // True for Android/iOS

  if (!isNative) {
    // Running in web browser during local development
    return serverUri;
  }
  
  // Running on a real phone or emulator -> use your cloud backend
  return serverUri;
};

export const environment = {
  production: true,
  apiUrl: getApiUrl(),
  cloudName: 'w28vsff3',
  presetName: 'pindder',
  stripe_pk: 'pk_test_51SDPx7JpXUibtX37NsVSpg4ZEiHjRyku980u6vBEVdHiZhb1ZHyTvRT1KenCKL8vzUIjUzFV2d9knp0TOVW2jOvj000YHK3c94'
};
