import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/react/solid';
import { FunctionComponent, useState } from 'react';
import { ICoin, IPortfolio } from '~/lib/types';
import { classNames, formatSymbolName, formatToNumber } from '~/lib/utils';
import TransactionModal from './TransactionModal';

interface IAssetsTableProps {
  portfolio: IPortfolio;
}

const AssetsTable: FunctionComponent<IAssetsTableProps> = ({
  portfolio,
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [coin, setCoin] = useState<ICoin | null>(null);

  const handleOnRowClick = (coin: ICoin): void => {
    setOpen(true);
    setCoin(coin);
  };

  const onModalClose = (): void => {
    setOpen(false);
    setCoin(null);
  };

  return (
    <div className='flex flex-col mt-4'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-primary-700'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-bold text-primary-50 uppercase tracking-wider'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-bold text-primary-50 uppercase tracking-wider'
                  >
                    Current Price
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-bold text-primary-50 uppercase tracking-wider'
                  >
                    Holdings
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-bold text-primary-50 uppercase tracking-wider hidden md:block'
                  >
                    Avg. Buy Price
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-bold text-primary-50 uppercase tracking-wider'
                  >
                    Profit/Loss
                  </th>
                </tr>
              </thead>
              <tbody className='bg-primary-50 dark:bg-primary-100 divide-y divide-gray-200 cursor-pointer'>
                {Object.entries(portfolio).map(([symbol, coin]) => (
                  <tr
                    key={symbol}
                    className={
                      coin.zone === 'PROFIT'
                        ? 'bg-profit-50 dark:bg-profit-100'
                        : 'bg-loss-50 dark:bg-loss-100'
                    }
                    onClick={(): void => handleOnRowClick(coin)}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10 hidden md:block'>
                          <img
                            className='h-10 w-10 rounded-full'
                            src={`https://cryptoicon-api.vercel.app/api/icon/${formatSymbolName(
                              symbol
                            ).toLowerCase()}`}
                            alt=''
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-bold text-gray-900'>
                            {formatSymbolName(symbol)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-sm leading-5 font-semibold text-slate-800 '>
                        ${formatToNumber(coin.currentPrice, 4)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-semibold'>
                        ${formatToNumber(coin.totalUsdtQuantity, 2)}
                      </div>
                      <div className='text-sm text-gray-500 font-medium'>
                        {formatToNumber(coin.totalQuantity, 4)}{' '}
                        {formatSymbolName(coin.symbol)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-sm leading-5 font-semibold text-slate-800 '>
                        ${formatToNumber(coin.averageBuyPrice || 0, 4)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-semibold'>
                        {coin.zone === 'LOSS' && '-'}$
                        {formatToNumber(coin.profitAndLoss || 0, 2)}
                      </div>

                      <div
                        className={classNames(
                          coin.zone === 'PROFIT'
                            ? ' text-green-800'
                            : ' text-red-800',
                          'inline-flex text-sm font-semibold md:mt-2 lg:mt-0'
                        )}
                      >
                        {coin.zone === 'PROFIT' ? (
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
                          {coin.zone === 'PROFIT' ? 'Increased' : 'Decreased'}{' '}
                          by
                        </span>
                        {formatToNumber(coin.profitAndLossPercentage || 0, 2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TransactionModal coin={coin} open={open} onModalClose={onModalClose} />
    </div>
  );
};

export default AssetsTable;
