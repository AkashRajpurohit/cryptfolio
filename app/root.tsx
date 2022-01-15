import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import twStyles from './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: twStyles },
  { rel: 'favicon', href: '/favicons/favicon.ico' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicons/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicons/favicon-16x16.png',
  },
  { rel: 'theme-color', href: '#0F172A' },
];

export const meta: MetaFunction = () => {
  return { title: 'Crypto Portfolio' };
};

export function App() {
  const { theme } = useTheme();
  return (
    <html lang='en' className={theme ? theme : 'dark'}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}
