import { LogoutIcon, RefreshIcon } from '@heroicons/react/solid';
import { FunctionComponent, useEffect } from 'react';
import { json, LoaderFunction, redirect, useFetcher } from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import useInterval from '~/hooks/useInterval';
import { getPortfolio } from '~/lib/binance';
import { IPortfolio } from '~/lib/types';
import { classNames, REFRESH_INTERVAL } from '~/lib/utils';
import { commitSession, getSession } from '~/sessions';

interface IDashboardLoaderData {
  portfolio: IPortfolio;
  usdtBalance: number | string;
  userId: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userId')) {
    session.flash('error', 'You must be logged in first.');
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  const userId = session.get('userId');

  const { portfolio, usdtBalance } = await getPortfolio({
    userId,
  });
  return json({ portfolio, usdtBalance, userId });
};

const Dashboard: FunctionComponent = (): JSX.Element => {
  const logout = useFetcher();
  const dashboard = useFetcher<IDashboardLoaderData>();
  const data = dashboard.data;

  useEffect(() => {
    dashboard.load('/dashboard');
  }, []);

  // Periodically refresh the dashboard data.
  useInterval(() => {
    // dashboard.load('/dashboard');
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

  const { portfolio, usdtBalance, userId } = data;

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
          <logout.Form method='post' action='/logout'>
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
      <DashboardStats portfolio={portfolio} usdtBalance={usdtBalance} />
      <div className='mt-4 text-2xl'>
        <h2 className='capitalize'>Your assets</h2>
        <AssetsTable portfolio={portfolio} />
      </div>
    </div>
  );
};

export default Dashboard;
