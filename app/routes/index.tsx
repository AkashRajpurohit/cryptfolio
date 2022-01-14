import { FunctionComponent } from 'react';

interface IHomeProps {}

const Home: FunctionComponent<IHomeProps> = (): JSX.Element => {
  return (
    <div>
      <h1 className='my-4 py-2 bg-clip-text bg-gradient-to-r font-extrabold from-pink-200 h1 leading-tighter md:text-6xl text-5xl text-center text-transparent to-blue-500 tracking-tighter'>
        Welcome to Crypto Portfolio
      </h1>
    </div>
  );
};

export default Home;
