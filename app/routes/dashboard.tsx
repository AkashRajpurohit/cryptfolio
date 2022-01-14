import { FunctionComponent } from 'react';
import { json, LoaderFunction, useLoaderData } from 'remix';
import AssetsTable from '~/components/AssetsTable';
import DashboardStats from '~/components/DashboardStats';
import { getPortfolio } from '~/lib/binance';
import { IPortfolio } from '~/lib/types';

interface IDashboardLoaderData {
  portfolio: IPortfolio;
  usdtBalance: number | string;
}

export const loader: LoaderFunction = async () => {
  const { portfolio, usdtBalance } = await getPortfolio({
    userId: 'password',
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
