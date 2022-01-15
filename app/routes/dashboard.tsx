import { FunctionComponent } from 'react';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import { getPortfolio } from '~/lib/binance';
import { IPortfolio } from '~/lib/types';
import { commitSession, getSession } from '~/sessions';

interface IDashboardLoaderData {
  portfolio: IPortfolio;
  usdtBalance: number | string;
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
  return json({ portfolio, usdtBalance });
};

const Dashboard: FunctionComponent = (): JSX.Element => {
  const { portfolio, usdtBalance } = useLoaderData<IDashboardLoaderData>();
  return (
    <div>
      <DashboardStats portfolio={portfolio} usdtBalance={usdtBalance} />

      <div className='mt-4 text-2xl'>
        <h2 className='capitalize'>Your assets</h2>
        <AssetsTable portfolio={portfolio} />
      </div>
    </div>
  );
};

export default Dashboard;
