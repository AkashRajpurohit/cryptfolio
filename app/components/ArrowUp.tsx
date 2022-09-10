import React from 'react';

export default function ArrowUp() {
  return (
    <span className='text-green-600'>
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
          d='M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18'
        />
      </svg>
    </span>
  );
}
