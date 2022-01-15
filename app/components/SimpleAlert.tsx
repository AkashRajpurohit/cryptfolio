import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import React, { FunctionComponent } from 'react';
import { classNames } from '~/lib/utils';

interface ISimpleAlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
}

const SimpleAlert: FunctionComponent<ISimpleAlertProps> = ({
  type,
  children,
}): JSX.Element => {
  const bg =
    type === 'success'
      ? 'bg-green-50'
      : type === 'error'
      ? 'bg-red-50'
      : type === 'warning'
      ? 'bg-yellow-50'
      : 'bg-blue-50';
  const border =
    type === 'success'
      ? 'border-green-400'
      : type === 'error'
      ? 'border-red-400'
      : type === 'warning'
      ? 'border-yellow-400'
      : 'border-blue-400';
  const iconColor =
    type === 'success'
      ? 'text-green-400'
      : type === 'error'
      ? 'text-red-400'
      : type === 'warning'
      ? 'text-yellow-400'
      : 'text-blue-400';
  const bodyColor =
    type === 'success'
      ? 'text-green-700'
      : type === 'error'
      ? 'text-red-700'
      : type === 'warning'
      ? 'text-yellow-700'
      : 'text-blue-700';

  const Icon =
    type === 'success'
      ? CheckCircleIcon
      : type === 'error'
      ? XCircleIcon
      : type === 'warning'
      ? ExclamationIcon
      : InformationCircleIcon;

  return (
    <div className={classNames('border-l-4 p-4 my-4', bg, border)}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <Icon
            className={classNames('h-5 w-5', iconColor)}
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <p className={classNames('text-sm', bodyColor)}>{children}</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAlert;
