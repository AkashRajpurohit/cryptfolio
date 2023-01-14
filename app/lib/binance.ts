import Binance from 'node-binance-api';
import { IBalance, ICoin, IDeposit, IPortfolio, ITrade } from './types';
import { blockedPairs, getAverage, transformDeposit, transformTrade } from './utils';

export const getBinanceClient = (userId: string) => {
  let API_KEY: string;
  let API_SECRET: string;

  switch (userId) {
    case process.env.AKASH_USER_ID:
      API_KEY = process.env.AKASH_BINANCE_API_KEY as string;
      API_SECRET = process.env.AKASH_BINANCE_API_SECRET as string;
      break;
    default:
      throw new Error('No API key found for this user');
  }

  if (!API_KEY || !API_SECRET) {
    throw new Error('No API key found for this user');
  }

  return new Binance().options({
    APIKEY: API_KEY,
    APISECRET: API_SECRET,
    family: 4,
    useServerTime: true,
    reconnect: true,
    recvWindow: 60000,
    verbose: true,
  });
};

export const getTradeForPair = async ({
  client,
  pair,
}: {
  client: Binance;
  pair: string;
}) => {
  if (blockedPairs.includes(pair)) {
    return [];
  }

  const trade = await client.trades(pair);

  return trade
    .map(transformTrade)
    .sort((a: ITrade, b: ITrade) => b.time - a.time);
};

export const getAllTrades = async ({ client }: { client: Binance }) => {
  const userPortfolio = await getUserBalance({ client });
  const userPortfolioPairs = Object.entries(userPortfolio)
    .filter(([key]) => key !== 'USDT') // Filter out USDT for trades calculation
    .map(([key]) => `${key}USDT`);

  const allTrades = await Promise.allSettled(
    userPortfolioPairs.map(async (pair) => getTradeForPair({ client, pair }))
  );

  const allValidTrades = allTrades
    .filter((trade) => trade.status === 'fulfilled')
    .map((trade) => (trade.status === 'fulfilled' ? trade.value : []))
    .map(trade => {
      const firstTrade = trade[trade.length - 1]
      if (firstTrade && firstTrade.type !== 'BUY') {
        return trade.slice(0, trade.length - 1);
      }
      return trade;
    })

  const trades = allValidTrades.flat();

  const usdtBalanceAvailable = Number(userPortfolio['USDT'].available)
  const usdtBalanceOnOrder = Number(userPortfolio['USDT'].onOrder)

  return { trades, usdtBalanceAvailable, usdtBalanceOnOrder };
};

const getBalances = async ({
  client,
}: {
  client: Binance;
}): Promise<Record<string, IBalance>> => {
  return client.balance();
};

const getUserDeposits = async ({
  client,
}: {
  client: Binance;
}): Promise<Record<string, IDeposit[]>> => {
  const deposits = await client.depositHistory();
  return deposits
    .filter((deposit: any) => deposit.status === 1)
    .map(transformDeposit)
    .sort((a: IDeposit, b: IDeposit) => b.time - a.time)
    .reduce((acc: Record<string, IDeposit[]>, deposit: IDeposit) => {
      if (acc[deposit.symbol]) {
        acc[deposit.symbol].push(deposit);
      } else {
        acc[deposit.symbol] = [deposit];
      }
      return acc;
    }, {});
};

const getUserBalance = async ({
  client,
}: {
  client: Binance;
}): Promise<Record<string, IBalance>> => {
  const balances = await getBalances({ client });

  const balancePortfolio = Object.entries(balances).reduce(
    (acc, [key, value]) => {
      const availableNum = Number(value.available);
      if (availableNum > 0) {
        acc[key] = { available: availableNum, onOrder: Number(value.onOrder) };
      }
      return acc;
    },
    {} as Record<string, IBalance>
  );

  return balancePortfolio;
};

export const getCurrentPrices = async ({ client }: { client: Binance }) => {
  return client.prices();
};

export const getPortfolio = async ({ userId }: { userId: string }) => {
  try {
    const client = getBinanceClient(userId);

    const { trades, usdtBalanceAvailable, usdtBalanceOnOrder } = await getAllTrades({ client });
    const deposits = await getUserDeposits({ client });

    const currentPrices = await getCurrentPrices({ client });

    const portfolio: IPortfolio = trades
      .map((trade) => {
        const currentPrice = Number(currentPrices[trade.symbol] || '0');
        return {
          ...trade,
          currentPrice,
        };
      })
      .reduce((acc: Record<string, ICoin>, trade) => {
        const { currentPrice, ...rest } = trade;
        const tradeQuantity = trade.quantity * (trade.type === 'SELL' ? -1 : 1);
        const tradeUsdtQuantity =
          trade.usdtQuantity * (trade.type === 'SELL' ? -1 : 1);

        acc[trade.symbol] = {
          symbol: trade.symbol,
          trades: [
            ...(acc[trade.symbol] ? acc[trade.symbol].trades : []),
            rest,
          ],
          deposits: deposits[trade.symbol] || [],
          currentPrice,
          totalQuantity: acc[trade.symbol]
            ? acc[trade.symbol].totalQuantity + tradeQuantity
            : tradeQuantity,
          totalUsdtQuantity: acc[trade.symbol]
            ? acc[trade.symbol].totalUsdtQuantity + tradeUsdtQuantity
            : tradeUsdtQuantity,
        };
        return acc;
      }, {});

    for (const coin in portfolio) {
      const deposits = portfolio[coin].deposits;
      if (deposits.length > 0) {
        // ! Next piece of code is a hack to better guess what should've been user deposits value be
        // ! It's not perfect but it's better than nothing
        for (const deposit of deposits) {
          portfolio[coin].totalQuantity += deposit.quantity;

          let nearestTradePrice = 0,
            nearestTradeTime = Infinity;
          for (const trade of portfolio[coin].trades) {
            if (Math.abs(trade.time - deposit.time) < nearestTradeTime) {
              nearestTradePrice = trade.price;
              nearestTradeTime = Math.abs(trade.time - deposit.time);
            }
          }

          if (nearestTradePrice === 0) {
            // User has done no trades, only deposits
            portfolio[coin].totalUsdtQuantity +=
              portfolio[coin].currentPrice * deposit.quantity;
          } else {
            portfolio[coin].totalUsdtQuantity +=
              nearestTradePrice * deposit.quantity;
          }
        }
      }

      if (portfolio[coin].totalQuantity > 0) {
        portfolio[coin].averageBuyPrice = getAverage(portfolio[coin]);

        portfolio[coin].currentValue =
          portfolio[coin].currentPrice * portfolio[coin].totalQuantity;

        const difference =
          Math.abs(portfolio[coin].currentValue ?? 0) -
          Math.abs(portfolio[coin].totalUsdtQuantity ?? 0);

        portfolio[coin].profitAndLoss = Math.abs(difference);
        
        portfolio[coin].profitAndLossPercentage =
          (Math.abs(portfolio[coin].profitAndLoss ?? 1) /
            Math.abs(portfolio[coin].totalUsdtQuantity)) *
          100;

        portfolio[coin].zone =
          difference === 0 ? 'NEUTRAL' : difference > 0 ? 'PROFIT' : 'LOSS';
      }
    }

    return { portfolio, usdtBalanceAvailable, usdtBalanceOnOrder };
  } catch (err) {
    console.error(err);
    throw new Error('Error getting portfolio information');
  }
};
