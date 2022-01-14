export interface IBalance {
  available: string;
  onOrder: string;
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
