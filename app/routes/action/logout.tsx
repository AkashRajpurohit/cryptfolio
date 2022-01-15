import { ActionFunction, redirect } from 'remix';
import { destroyAuthSession, getAuthSession } from '~/sessions';

export const action: ActionFunction = async ({ request }) => {
  const session = await getAuthSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroyAuthSession(session),
    },
  });
};

const Logout = () => {
  return <div>Logging out...</div>;
};

export default Logout;
