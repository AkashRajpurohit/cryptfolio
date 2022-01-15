import { ActionFunction, redirect } from 'remix';
import { destroySession, getSession } from '~/sessions';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

const Logout = () => {
  return <div>Logging out...</div>;
};

export default Logout;
