import { ActionFunction, json } from 'remix';
import { commitThemeSession, getThemeSession } from '~/sessions';

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request.headers.get('Cookie'));

  if (!themeSession.has('theme')) {
    themeSession.set('theme', 'dark');
  } else {
    const currentTheme = themeSession.get('theme');
    if (currentTheme === 'dark') {
      themeSession.set('theme', 'light');
    } else {
      themeSession.set('theme', 'dark');
    }
  }

  return json(
    { success: true },
    {
      headers: {
        'Set-Cookie': await commitThemeSession(themeSession),
      },
    }
  );
};

const ThemeSwitcher = () => {
  return <div>Switching themes</div>;
};

export default ThemeSwitcher;
