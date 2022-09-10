import {
  LogoutIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon,
} from '@heroicons/react/solid';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  json,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
} from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import { useTheme } from '~/components/ThemeProvider';
import useInterval from '~/hooks/useInterval';
import { getPortfolio } from '~/lib/binance';
import { getKucoinWSConnectionDetails } from '~/lib/ticker';
import { CoinTracker, ICoin, IPortfolio, KuCoin } from '~/lib/types';
import { commitAuthSession, getAuthSession } from '~/sessions';

interface IDashboardLoaderData {
  portfolio: IPortfolio;
  usdtBalanceAvailable: number;
  usdtBalanceOnOrder: number;
  userId: string;
  kuCoinInfo: KuCoin | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getAuthSession(request.headers.get('Cookie'));
  if (!session.has('userId')) {
    session.flash('error', 'You must be logged in first.');
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitAuthSession(session),
      },
    });
  }

  const userId = session.get('userId');

  const { portfolio, usdtBalanceAvailable, usdtBalanceOnOrder } =
    await getPortfolio({
      userId,
    });
  const kuCoinInfo = await getKucoinWSConnectionDetails();

  return json({
    portfolio,
    usdtBalanceAvailable,
    usdtBalanceOnOrder,
    userId,
    kuCoinInfo,
  });
};

const Dashboard: FunctionComponent = (): JSX.Element => {
  const logout = useFetcher();
  const dashboard = useLoaderData<IDashboardLoaderData>();
  const { toggleTheme, theme } = useTheme();
  const [socket, setSocket] = useState<WebSocket>();
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [pingInterval, setPingInterval] = useState(10000);
  const [coinTracker, setCoinTracker] = useState<CoinTracker>({});

  useEffect(() => {
    if (dashboard) {
      const { kuCoinInfo } = dashboard;
      const data = kuCoinInfo?.data;
      if (!data) {
        return;
      }

      const token = data.token;
      const server = data.instanceServers[0];

      const socket = new WebSocket(`${server.endpoint}?token=${token}`);
      setSocket(socket);
      setPingInterval(server.pingInterval - 4000);
    }

    return () => {
      socket?.close();
    };
  }, [dashboard]);

  // Periodically send pings to websocket server to keep connection alive
  useInterval(() => {
    if (socket) {
      socket.send(`{"id": ${Date.now()}, "type": "ping"}`);
    }
  }, pingInterval);

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener('open', () => {
      setIsSocketReady(true);
    });

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'message') {
        const coin = message.topic
          .split(':')[1]
          .replace('-', '') as ICoin['symbol'];
        const currentPrice = message.data.price as number;

        setCoinTracker((previousTracker) => {
          let direction: 'UP' | 'DOWN' = 'UP';

          if (previousTracker[coin]) {
            if (currentPrice > previousTracker[coin].price) {
              direction = 'UP';
            } else if (currentPrice < previousTracker[coin].price) {
              direction = 'DOWN';
            } else {
              return previousTracker;
            }
          }

          return {
            ...previousTracker,
            [coin]: {
              price: currentPrice,
              direction,
            },
          };
        });
      } else if (message.type === 'pong') {
        console.log('Server got pinged, here take your pong: ', message.id);
      }
    });
  }, [socket]);

  useEffect(() => {
    const { portfolio } = dashboard;
    const marketTickers = Object.keys(portfolio).map(
      (coin) => coin.replace('USDT', '') + '-USDT',
    );

    socket?.send(`{
      "id": ${Date.now()},
      "type": "subscribe",
      "topic": "/market/ticker:${marketTickers.join(',')}",
      "privateChannel": false,
      "response": true
    }`);
  }, [isSocketReady]);

  if (!dashboard) {
    return (
      <div className='min-h-[80vh] flex flex-col justify-center items-center'>
        <RefreshIcon className='h-16 w-16 animate-spin' />
        <span className='text-xl font-semibold'>Hang on a bit!!</span>
      </div>
    );
  }

  const { portfolio, userId, usdtBalanceAvailable, usdtBalanceOnOrder } =
    dashboard;

  return (
    <div>
      <div className='flex flex-row justify-between'>
        <h1 className='text-xl'>Welcome, {userId}!</h1>
        <div className='flex flex-row items-center gap-4'>
          <button
            className='bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-50 font-semibold hover:text-gray-600 border border-gray-400 hover:border-transparent rounded-full p-2'
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <MoonIcon className='h-5 w-5' />
            ) : (
              <SunIcon className='h-5 w-5' />
            )}
          </button>
          <logout.Form method='post' action='/action/logout'>
            <button
              type='submit'
              className='bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full ring-red-500 ring-offset-1'
              aria-labelledby='Logout'
              title='Logout'
            >
              <LogoutIcon className='h-5 w-5' />
            </button>
          </logout.Form>
        </div>
      </div>
      <DashboardStats
        portfolio={portfolio}
        usdtBalanceAvailable={usdtBalanceAvailable}
        usdtBalanceOnOrder={usdtBalanceOnOrder}
      />
      <div className='mt-4'>
        <h2 className='capitalize my-6 text-3xl font-bold'>Your assets</h2>
        <AssetsTable portfolio={portfolio} coinTracker={coinTracker} />
      </div>
    </div>
  );
};

export default Dashboard;
