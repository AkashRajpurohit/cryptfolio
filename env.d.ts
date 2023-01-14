declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string;
    BINANCE_API_KEY: string;
    BINANCE_API_SECRET: string;
    USER_ID: string;
    USER_PASSWORD: string;
  }
}