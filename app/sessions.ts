import { createCookieSessionStorage } from 'remix';
import { AUTH_COOKIE_EXPIRE_TIME, THEME_COOKIE_EXPIRE_TIME } from '~/lib/utils';

const {
  getSession: getAuthSession,
  commitSession: commitAuthSession,
  destroySession: destroyAuthSession,
} = createCookieSessionStorage({
  cookie: {
    name: '__session',
    expires: new Date(Date.now() + AUTH_COOKIE_EXPIRE_TIME),
    httpOnly: true,
    maxAge: AUTH_COOKIE_EXPIRE_TIME,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === 'production',
  },
});

const {
  getSession: getThemeSession,
  commitSession: commitThemeSession,
  destroySession: destroyThemeSession,
} = createCookieSessionStorage({
  cookie: {
    name: '__theme',
    expires: new Date(Date.now() + THEME_COOKIE_EXPIRE_TIME),
    httpOnly: true,
    maxAge: THEME_COOKIE_EXPIRE_TIME,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === 'production',
  },
});

export {
  getAuthSession,
  commitAuthSession,
  destroyAuthSession,
  getThemeSession,
  commitThemeSession,
  destroyThemeSession,
};
