import { twMerge } from 'tailwind-merge';
import { ICoin, IDeposit, IPortfolio, ITrade } from './types';

export const transformTrade = (trade: any): ITrade => {
  return {
    id: trade.id,
    orderId: trade.orderId,
    price: formatToNumber(trade.price),
    symbol: trade.symbol,
    quantity: formatToNumber(trade.qty),
    usdtQuantity: formatToNumber(trade.quoteQty),
    commission: Number(trade.commission),
    commissionAsset: trade.commissionAsset,
    time: trade.time,
    type: trade.isBuyer ? 'BUY' : 'SELL',
  };
};

export const transformDeposit = (deposit: any): IDeposit => {
  return {
    id: deposit.txId,
    symbol: `${deposit.coin}USDT`,
    quantity: formatToNumber(deposit.amount),
    time: deposit.insertTime,
  };
};

export const formatToNumber = (
  value: string | number,
  decimal = 10
): number => {
  return Number(Number(value).toFixed(decimal));
};

export const classNames = (...classes: string[]) => {
  return twMerge(classes.filter(Boolean).join(' '));
};

export const getCurrentUSDTValueOfPortfolio = (portfolio: IPortfolio) => {
  return Object.values(portfolio).reduce(
    (acc, coin: ICoin) => acc + (coin.currentValue || 0),
    0
  );
};

export const getTotalInvestedUSDTValueOfPortfolio = (portfolio: IPortfolio) => {
  return Object.values(portfolio).reduce(
    (acc, coin: ICoin) => acc + (coin.totalUsdtQuantity || 0),
    0
  );
};

export const formatSymbolName = (symbol: string) => {
  return symbol.replace('USDT', '');
};

export const COOKIE_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export const REFRESH_INTERVAL = 1000 * 15; // 15 seconds
