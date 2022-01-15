import { LogoutIcon } from '@heroicons/react/solid';
import { FunctionComponent } from 'react';
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import { getPortfolio } from '~/lib/binance';
import { IPortfolio } from '~/lib/types';
import { commitSession, destroySession, getSession } from '~/sessions';

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

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

const Dashboard: FunctionComponent = (): JSX.Element => {
  const { portfolio, usdtBalance, userId } =
    useLoaderData<IDashboardLoaderData>();
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <h1 className='text-xl'>Welcome, {userId}!</h1>
        <div>
          <Form method='post'>
            <button
              type='submit'
              className='bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full ring-red-500 ring-offset-1'
              aria-labelledby='Logout'
              title='Logout'
            >
              <LogoutIcon className='h-5 w-5' />
            </button>
          </Form>
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
