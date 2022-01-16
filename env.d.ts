declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string;
    AKASH_BINANCE_API_KEY: string;
    AKASH_BINANCE_API_SECRET: string;
    AKASH_USER_ID: string;
    AKASH_USER_PASSWORD: string;
  }
}