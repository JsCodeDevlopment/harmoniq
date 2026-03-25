import { ClientCookieHelper } from './cookie.helper';

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export class TokenHelper {
  // Defining the cookie keys
  private static ACCESS_TOKEN_KEY: string = 'ACCESS_TOKEN';
  private static REFRESH_TOKEN_KEY: string = 'REFRESH_TOKEN';

  static get() {
    const accessToken = ClientCookieHelper.get(this.ACCESS_TOKEN_KEY);
    const refreshToken = ClientCookieHelper.get(this.REFRESH_TOKEN_KEY);

    return {
      accessToken,
      refreshToken,
    };
  }

  static set({ accessToken, refreshToken }: AuthToken) {
    // Set cookies on the client side (simplifying to client-side only for now as requested)
    ClientCookieHelper.set(this.ACCESS_TOKEN_KEY, accessToken);
    ClientCookieHelper.set(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static delete() {
    // Delete cookies on the client side
    ClientCookieHelper.delete(this.ACCESS_TOKEN_KEY);
    ClientCookieHelper.delete(this.REFRESH_TOKEN_KEY);
  }
}
