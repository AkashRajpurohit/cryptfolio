import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { CoinTracker, ICoin, IDeposit, IPortfolio, ITrade } from './types';

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
  decimal = 10,
): number => {
  return Number(Number(value).toFixed(decimal));
};

export const classNames = (...classes: string[]) => {
  return twMerge(classes.filter(Boolean).join(' '));
};

export const getCurrentUSDTValueOfPortfolio = (
  portfolio: IPortfolio,
  coinTracker: CoinTracker,
) => {
  return Object.values(portfolio).reduce(
    (acc, coin: ICoin) =>
      acc + ((coinTracker[coin.symbol]?.price ?? coin.currentPrice) * coin.totalQuantity ?? 0),
    0,
  );
};

export const getTotalInvestedUSDTValueOfPortfolio = (portfolio: IPortfolio) => {
  return Object.values(portfolio).reduce(
    (acc, coin: ICoin) => acc + (coin.totalUsdtQuantity || 0),
    0,
  );
};

export const formatSymbolName = (symbol: string) => {
  return symbol.replace('USDT', '');
};

export const formatDate = (date: number) => {
  return dayjs(date).format('MMM DD, YYYY, hh:mm A');
};

export const getAverage = (coin: ICoin) => {
  const { trades } = coin;
  const buyTrades = trades.filter((trade) => trade.type === 'BUY');
  const buyTradesTotal = buyTrades.reduce(
    (acc, trade) => acc + trade.usdtQuantity,
    0,
  );
  const buyTradesQuantity = buyTrades.reduce(
    (acc, trade) => acc + trade.quantity,
    0,
  );

  return buyTradesTotal / buyTradesQuantity;
};

export const blockedPairs = ['LUNAUSDT', 'LUNCUSDT'];

export const AUTH_COOKIE_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export const THEME_COOKIE_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 365; // 1 year
export const REFRESH_INTERVAL = 1000 * 30; // 30 seconds
