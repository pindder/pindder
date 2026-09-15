import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';

  async setKeyValue(key: string, val: string): Promise<void> {
    await Preferences.set({
      key: key,
      value: val
    });
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token,
    });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({
      key: this.TOKEN_KEY,
    });

    return value;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();

    return !!token;
  }

  async removeToken() {
    await Preferences.remove({
      key: this.TOKEN_KEY,
    });
  }
}
