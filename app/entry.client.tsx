import { hydrate } from 'react-dom';
import { RemixBrowser } from 'remix';

hydrate(<RemixBrowser />, document);

// If the browser supports service workers, register one.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // We will register if after the page is loaded
    navigator.serviceWorker.register('/sw.js');
  });
}
