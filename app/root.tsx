import {
  json,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData
} from 'remix';
import { Theme, ThemeProvider, useTheme } from '~/components/ThemeProvider';
import { getThemeSession } from '~/sessions';
import twStyles from '~/tailwind.css';

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
];

export const meta: MetaFunction = () => {
  return {
    title: 'Crypfolio',
    description: 'My Crypto Portfolio synched with Binance',
    'theme-color': '#0F172A',
    'og:title': 'Crypfolio',
    'og:description': 'My Crypto Portfolio synched with Binance',
    'og:image': 'https://crypfolio.com/favicons/apple-touch-icon.png',
    'og:image:width': '512',
    'og:image:height': '512',
    'og:image:type': 'image/png',
    'og:url': 'https://crypfolio.akashrajpurohit.com',
    'og:site_name': 'Crypfolio',
    'og:locale': 'en_US',
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Crypfolio',
    'twitter:description': 'My Crypto Portfolio synched with Binance',
    'twitter:image': 'https://crypfolio.com/favicons/apple-touch-icon.png',
    'twitter:image:width': '512',
    'twitter:image:height': '512',
    'twitter:image:type': 'image/png',
    'twitter:url': 'https://crypfolio.akashrajpurohit.com',
    'twitter:site': '@akashrajpurohit',
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request.headers.get('Cookie'));

  return json({ theme: themeSession.get('theme') || 'dark' });
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
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            defer
            data-website-id='3a193c62-52cb-4964-8dcf-caa1c5cb1c7f'
            src='https://umami-akash.vercel.app/umami.js'
          ></script>
        )}
      </head>
      <body className='bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10 selection:bg-primary-300 selection:text-primary-900'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const { theme } = useLoaderData<{ theme: Theme }>();
  return (
    <ThemeProvider specifiedTheme={theme}>
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
