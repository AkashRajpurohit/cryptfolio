import { createCookieSessionStorage } from 'remix';
import { COOKIE_EXPIRE_TIME } from '~/lib/utils';

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      expires: new Date(Date.now() + COOKIE_EXPIRE_TIME),
      httpOnly: true,
      maxAge: COOKIE_EXPIRE_TIME,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET as string],
      secure: process.env.NODE_ENV === 'production',
    },
  });

export { getSession, commitSession, destroySession };
