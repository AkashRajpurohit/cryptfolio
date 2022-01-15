import {
  MinusCircleIcon,
  PlusCircleIcon,
  SaveIcon,
} from '@heroicons/react/solid';
import React, { FunctionComponent } from 'react';
import { ICoin } from '~/lib/types';
import { classNames, formatDate, formatSymbolName } from '~/lib/utils';

interface ITransactionFeedProps {
  coin: ICoin | null;
}

const TransactionFeed: FunctionComponent<ITransactionFeedProps> = ({
  coin,
}): JSX.Element => {
  if (!coin) return <div></div>;

  const { trades, deposits } = coin;

  return (
    <div className='flow-root'>
      <ul role='list' className='-mb-8'>
        {trades.map((trade, eventIdx) => (
          <li key={trade.id}>
            <div className='relative pb-8'>
              {eventIdx !== trades.length - 1 ? (
                <span
                  className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}
              <div className='relative flex space-x-3'>
                <div>
                  <span
                    className={classNames(
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                      trade.type === 'BUY' ? 'bg-profit-400' : 'bg-loss-400'
                    )}
                  >
                    {trade.type === 'BUY' ? (
                      <PlusCircleIcon
                        className='h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                    ) : (
                      <MinusCircleIcon
                        className='h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                    )}
                  </span>
                </div>
                <div className='min-w-0 flex-1 pt-1.5 flex justify-between space-x-4'>
                  <div>
                    <p className='text-sm text-gray-600'>
                      <span className='font-semibold'>
                        {trade.type === 'BUY' ? 'Brought' : 'Sold'}
                      </span>{' '}
                      <span className='font-bold'>
                        {trade.quantity} {formatSymbolName(trade.symbol)}
                      </span>{' '}
                      for <span className='font-bold'>{trade.price}</span> i.e{' '}
                      <span className='font-bold'>${trade.usdtQuantity}</span>
                    </p>
                  </div>
                  <div className='text-right text-sm whitespace-pre-wrap text-gray-500 font-semibold'>
                    <time dateTime={new Date(trade.time).toDateString()}>
                      {formatDate(trade.time)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}

        {deposits.map((deposit, eventIdx) => (
          <li key={deposit.id}>
            <div className='relative pb-8'>
              {eventIdx !== deposits.length - 1 ? (
                <span
                  className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}
              <div className='relative flex space-x-3'>
                <div>
                  <span
                    className={
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-primary-400'
                    }
                  >
                    <SaveIcon
                      className='h-5 w-5 text-white'
                      aria-hidden='true'
                    />
                  </span>
                </div>
                <div className='min-w-0 flex-1 pt-1.5 flex justify-between space-x-4'>
                  <div>
                    <p className='text-sm text-gray-600'>
                      <span className='font-semibold'>Deposited</span>{' '}
                      <span className='font-bold'>
                        {deposit.quantity} {formatSymbolName(deposit.symbol)}
                      </span>{' '}
                    </p>
                  </div>
                  <div className='text-right text-sm whitespace-pre-wrap text-gray-500 font-semibold'>
                    <time dateTime={new Date(deposit.time).toDateString()}>
                      {formatDate(deposit.time)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionFeed;
