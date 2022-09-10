import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';
import { FunctionComponent } from 'react';
import { CoinTracker, IPortfolio } from '~/lib/types';
import {
  classNames,
  formatToNumber,
  getCurrentUSDTValueOfPortfolio,
  getTotalInvestedUSDTValueOfPortfolio
} from '~/lib/utils';

interface IDashboardStats {
  portfolio: IPortfolio;
  usdtBalanceAvailable: number;
  usdtBalanceOnOrder: number;
  coinTracker: CoinTracker;
}

const DashboardStats: FunctionComponent<IDashboardStats> = ({
  portfolio,
  usdtBalanceAvailable,
  usdtBalanceOnOrder,
  coinTracker
}): JSX.Element => {
  const currentUSDTValue = formatToNumber(
    getCurrentUSDTValueOfPortfolio(portfolio, coinTracker),
    2
  );
  const totalUSDTInvested = formatToNumber(
    getTotalInvestedUSDTValueOfPortfolio(portfolio),
    2
  );
  const changeType =
    currentUSDTValue > totalUSDTInvested ? 'increase' : 'decrease';
  const change = formatToNumber(
    (Math.abs(currentUSDTValue - totalUSDTInvested) / totalUSDTInvested) * 100,
    2
  );

  return (
    <div className='mt-4'>
      <dl
        className={classNames(
          'mt-5 grid grid-cols-1 rounded-lg bg-primary-50 dark:bg-primary-800 overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x',
          changeType === 'increase'
            ? 'bg-profit-200 dark:bg-profit-800'
            : 'bg-loss-200 dark:bg-loss-800'
        )}
      >
        <div className='px-4 py-5 sm:p-6'>
          <dt className='text-xl font-normal text-gray-900 dark:text-primary-50'>
            Current Balance
          </dt>
          <dd className='mt-1 flex justify-between items-baseline md:block lg:flex'>
            <div className='flex flex-col gap-1 items-baseline text-3xl font-bold text-primary-600 dark:text-primary-50'>
              ${currentUSDTValue}
              <span className='text-sm font-semibold text-slate-500 dark:text-primary-200'>
                from ${totalUSDTInvested}
              </span>
            </div>

            <div
              className={classNames(
                changeType === 'increase'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
                'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-semibold md:mt-2 lg:mt-0'
              )}
            >
              {changeType === 'increase' ? (
                <ArrowSmUpIcon
                  className='-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500'
                  aria-hidden='true'
                />
              ) : (
                <ArrowSmDownIcon
                  className='-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500'
                  aria-hidden='true'
                />
              )}
              <span className='sr-only'>
                {changeType === 'increase' ? 'Increased' : 'Decreased'} by
              </span>
              {change}%
            </div>
          </dd>
        </div>

        <div className='px-4 py-5 sm:p-6 bg-primary-100 dark:bg-primary-800'>
          <dt className='text-xl font-normal text-gray-900 dark:text-primary-50'>
            USDT Available
          </dt>
          <dd className='mt-1 flex justify-between items-baseline md:block lg:flex'>
            <div className='flex items-baseline text-3xl font-bold text-primary-600 dark:text-primary-50'>
              ${formatToNumber(usdtBalanceAvailable, 2)}
            </div>
          </dd>
        </div>

        <div className='px-4 py-5 sm:p-6 bg-green-200 dark:bg-green-600'>
          <dt className='text-xl font-normal text-gray-900 dark:text-primary-50'>
            USDT on Order
          </dt>
          <dd className='mt-1 flex justify-between items-baseline md:block lg:flex'>
            <div className='flex items-baseline text-3xl font-bold text-primary-600 dark:text-primary-50'>
              ${formatToNumber(usdtBalanceOnOrder, 2)}
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default DashboardStats;
