import { FunctionComponent } from 'react';
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import SigninForm from '~/components/SigninForm';
import { validateCredentials } from '~/lib/auth';
import { commitSession, getSession } from '~/sessions';

interface IHomeProps {}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('userId')) {
    return redirect('/dashboard');
  }

  const data = { error: session.get('error') };

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const form = await request.formData();
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  const userId = await validateCredentials({ username, password });

  if (userId === null) {
    session.flash('error', 'Invalid username/password');

    // Redirect back to the home page with errors.
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  session.set('userId', userId);

  // Login succeeded, send them to the dashboard page.
  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

const Home: FunctionComponent<IHomeProps> = (): JSX.Element => {
  const { error } = useLoaderData();
  console.log({ error });
  return (
    <div>
      <h1 className='my-4 py-2 bg-clip-text bg-gradient-to-r font-extrabold from-violet-400 to-rose-500 dark:from-pink-200 dark:to-violet-500 h1 leading-tighter md:text-6xl text-5xl text-center text-transparent tracking-tighter'>
        Welcome to Crypto Portfolio
      </h1>

      <div className='flex flex-col justify-center py-20 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-primary-800 dark:text-primary-100'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <Form method='post' className='space-y-6'>
              <SigninForm />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
