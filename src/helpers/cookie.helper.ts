export class ClientCookieHelper {
  // Recupera o valor de um cookie no lado do cliente
  public static get(key: string): string | undefined {
    if (typeof document !== 'undefined') {
      const cookiesStore = document.cookie;
      const match = cookiesStore.match(new RegExp(`(^|;\\s*)${key}=([^;]*)`));
      return match && match[2] ? decodeURIComponent(match[2]) : undefined;
    }
    // Return undefined if it's running on the server-side (where document is not available)
    return undefined;
  }

  // Define o valor de um cookie no lado do cliente
  public static set(key: string, value: string, days?: number) {
    if (typeof document !== 'undefined') {
      let cookie = `${key}=${encodeURIComponent(value)}; path=/`;
      if (days) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
        cookie += `; expires=${expirationDate.toUTCString()}`;
      }
      document.cookie = cookie;
    }
  }

  // Deleta um cookie no lado do cliente
  public static delete(key: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
  }
}
