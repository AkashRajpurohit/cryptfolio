import { FunctionComponent } from 'react';
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
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
      <h1 className='my-4 py-2 bg-clip-text bg-gradient-to-r font-extrabold from-pink-200 h1 leading-tighter md:text-6xl text-5xl text-center text-transparent to-blue-500 tracking-tighter'>
        Welcome to Crypto Portfolio
      </h1>

      <div className='text-gray-500'>
        {error && <div className='error'>{error}</div>}
        <Form method='post'>
          <div>
            <p>Please sign in</p>
          </div>
          <label>
            Username: <input type='text' name='username' />
          </label>
          <label>
            Password: <input type='password' name='password' />
          </label>
          <input type='submit' value='Sign in' />
        </Form>
      </div>
    </div>
  );
};

export default Home;
