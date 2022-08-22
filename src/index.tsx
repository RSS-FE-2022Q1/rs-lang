import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { StrictMode } from 'react';

import { store } from './store/store';

import App from '@/App';
import './index.pcss';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
