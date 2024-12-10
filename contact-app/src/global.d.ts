declare module '*.css';
// src/global.d.ts (or in a custom types folder)
// src/global.d.ts
declare module 'jwt-decode' {
  interface DecodedToken {
    exp: number; 
    iat: number; // Issued at time as a Unix timestamp
    sub: string; // Subject of the token (this depends on your API)
    [key: string]: unknown; // Allow additional custom fields
  }

  const jwt_decode: (token: string) => DecodedToken;
  export = jwt_decode;
}

declare module 'js-cookie' {
  interface CookiesStatic {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: Record<string, unknown>): void;
    remove(name: string, options?: Record<string, unknown>): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
