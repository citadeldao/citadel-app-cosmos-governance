import React from 'react';
import './components/styles/index.css';
import App from './App';
import { store } from './store/store';
import routes from './routes';
import { Provider } from 'react-redux';
import Splash from '@citadeldao/apps-ui-kit/dist/components/uiKit/Splash';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Config } from './components/config/config';
import { walletActions } from './store/actions/index';

if (window.location.hash !== routes.HOME && process.env.NODE_ENV !== 'production') {
    window.location.hash = routes.HOME;
}

if (process.env.REACT_APP_SENTRY_URL) {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_URL,
        integrations: [new BrowserTracing()],
        tracesSampleRate: 0.5,
        tunnel: new URL(process.env.REACT_APP_SENTRY_URL).origin + '/tunnel',
        environment: process.env.REACT_APP_SENTRY_ENV,
    });
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider store={store}><App/></Provider>);

const config = new Config();
const splashContainer = document.getElementById('splash');
const splashRoot = createRoot(splashContainer);
splashRoot.render(<Splash config={config.splashParamsFromConfig()}/>);

const r = document.querySelector(':root');

r.style.setProperty('--appThemeColor', config.tabbarParamsFromConfig('BACKGROUND_COLOR'));

function listener(event) {
    // console.log('EVENT FROM FRONT', event.data);
    if(event.data?.from === 'metamask'){
      walletActions.updateWalletList(event.data)
    }
  }

  if (window.addEventListener) {
    console.log('subscribe front');
    window.addEventListener("message", listener,false);
  }
