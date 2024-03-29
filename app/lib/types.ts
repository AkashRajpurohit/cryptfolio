export interface IBalance {
  available: string | number;
  onOrder: string | number;
}

export interface ITrade {
  id: number | string;
  orderId: number;
  price: number;
  symbol: string;
  quantity: number;
  usdtQuantity: number;
  commission: number;
  commissionAsset: string;
  time: number;
  type: 'BUY' | 'SELL';
}

export interface IDeposit {
  id: string;
  quantity: number;
  symbol: string;
  time: number;
}

export interface ICoin {
  symbol: string;
  currentPrice: number;
  totalQuantity: number;
  totalUsdtQuantity: number;
  averageBuyPrice?: number;
  currentValue?: number;
  profitAndLoss?: number;
  profitAndLossPercentage?: number;
  zone?: 'PROFIT' | 'LOSS' | 'NEUTRAL';
  trades: ITrade[];
  deposits: IDeposit[];
}

export interface IPortfolio {
  [key: string]: ICoin;
}

export interface KuCoin {
  code: string;
  data: Data;
}
export interface Data {
  token: string;
  instanceServers: (InstanceServersEntity)[];
}
export interface InstanceServersEntity {
  endpoint: string;
  encrypt: boolean;
  protocol: string;
  pingInterval: number;
  pingTimeout: number;
}

export interface CoinTracker {
  [key: string]: {
    price: number;
    direction: 'UP' | 'DOWN';
  }
}