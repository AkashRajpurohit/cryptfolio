import React from 'react';

export default function ArrowDown() {
  return (
    <span className='text-red-600'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={2}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3'
        />
      </svg>
    </span>
  );
}
