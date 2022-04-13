import { Fragment, FunctionComponent, useState } from 'react';
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
    <Fragment>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-primary-700'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-primary-50 uppercase tracking-wider'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-primary-50 uppercase tracking-wider'
                    >
                      Holdings
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-primary-50 uppercase tracking-wider'
                    >
                      Current Price
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-primary-50 uppercase tracking-wider'
                    >
                      Avg Buy Price
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-primary-50 uppercase tracking-wider'
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
                          ? 'bg-profit-100 dark:bg-profit-200'
                          : 'bg-loss-100 dark:bg-loss-200'
                      }
                      onClick={(): void => handleOnRowClick(coin)}
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 h-10 w-10'>
                            <img
                              className='h-10 w-10 rounded-full'
                              src={`https://cryptoicon-api-ten.vercel.app/api/icon/${formatSymbolName(
                                symbol
                              ).toLowerCase()}`}
                              alt={`${symbol} icon`}
                            />
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {formatSymbolName(symbol)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900 font-semibold'>
                          {formatToNumber(coin.totalQuantity, 4)}{' '}
                          {formatSymbolName(coin.symbol)}
                        </div>
                        <div className='text-sm text-gray-600 font-medium'>
                          ${formatToNumber(coin.totalUsdtQuantity, 2)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 inline-flex text-sm leading-5 font-semibold text-gray-800'>
                          ${formatToNumber(coin.currentPrice, 4)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <span className='px-2 inline-flex text-sm leading-5 font-semibold text-gray-800'>
                          ${formatToNumber(coin.averageBuyPrice || 0, 4)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col gap-2 items-center'>
                        <div className='text-sm text-gray-900 font-semibold'>
                          {coin.zone === 'LOSS' && '-'}$
                          {formatToNumber(coin.profitAndLoss || 0, 2)}
                        </div>
                        <div className='text-sm text-gray-600 font-medium'>
                          <span
                            className={classNames(
                              'rounded-full py-1 px-4',
                              coin.zone === 'PROFIT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}
                          >
                            {formatToNumber(
                              coin.profitAndLossPercentage || 0,
                              2
                            )}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <TransactionModal coin={coin} open={open} onModalClose={onModalClose} />
    </Fragment>
  );
};

export default AssetsTable;
