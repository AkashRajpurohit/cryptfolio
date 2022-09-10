import {
  LogoutIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon
} from '@heroicons/react/solid';
import { FunctionComponent, useEffect } from 'react';
import { json, LoaderFunction, redirect, useFetcher } from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import { useTheme } from '~/components/ThemeProvider';
import useInterval from '~/hooks/useInterval';
import { getPortfolio } from '~/lib/binance';
import { IPortfolio } from '~/lib/types';
import { classNames, REFRESH_INTERVAL } from '~/lib/utils';
import { commitAuthSession, getAuthSession } from '~/sessions';

interface IDashboardLoaderData {
  portfolio: IPortfolio;
  usdtBalanceAvailable: number;
  usdtBalanceOnOrder: number;
  userId: string;
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

  const { portfolio, usdtBalanceAvailable, usdtBalanceOnOrder } = await getPortfolio({
    userId,
  });
  return json({ portfolio, usdtBalanceAvailable, usdtBalanceOnOrder, userId });
};

const Dashboard: FunctionComponent = (): JSX.Element => {
  const logout = useFetcher();
  const dashboard = useFetcher<IDashboardLoaderData>();
  const data = dashboard.data;
  const { toggleTheme, theme } = useTheme();

  useEffect(() => {
    dashboard.load('/dashboard');
  }, []);

  // Periodically refresh the dashboard data.
  useInterval(() => {
    // If the user is not currently on this tab, don't keep refreshing the data and avoid abusing the API.
    if (document && !document.hidden) {
      dashboard.load('/dashboard');
    }
  }, REFRESH_INTERVAL);

  if (!data && dashboard.state === 'loading') {
    return (
      <div className='min-h-[80vh] flex flex-col justify-center items-center'>
        <RefreshIcon className='h-16 w-16 animate-spin' />
        <span className='text-xl font-semibold'>Hang on a bit!!</span>
      </div>
    );
  }
  if (!data) return <></>;

  const { portfolio, userId, usdtBalanceAvailable, usdtBalanceOnOrder } = data;

  return (
    <div>
      <div className='flex flex-row justify-between'>
        <h1 className='text-xl'>Welcome, {userId}!</h1>
        <div className='flex flex-row items-center gap-4'>
          <span className='text-sm flex flex-row items-center gap-4'>
            {dashboard.state === 'loading' && (
              <span className='hidden md:block'>Refreshing...</span>
            )}
            <RefreshIcon
              className={classNames(
                'h-5 w-5',
                dashboard.state === 'loading' ? 'animate-spin' : 'animate-none'
              )}
            />
          </span>
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
      <DashboardStats portfolio={portfolio} usdtBalanceAvailable={usdtBalanceAvailable} usdtBalanceOnOrder={usdtBalanceOnOrder} />
      <div className='mt-4'>
        <h2 className='capitalize my-6 text-3xl font-bold'>Your assets</h2>
        <AssetsTable portfolio={portfolio} />
      </div>
    </div>
  );
};

export default Dashboard;
