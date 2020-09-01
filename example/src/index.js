/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import rootReducer from './reducers';
import App from './components/App';
import IFrame from './components/IFrame';
import registerServiceWorker from './registerServiceWorker';
import { createStateSyncMiddleware, initStateWithPrevTab } from './lib/syncState';

const middlewares = [
    // TOGGLE_TODO will not be triggered
    createStateSyncMiddleware({
        channel: 'example',
        predicate: action => action.type !== 'TOGGLE_TODO',
    }),
];
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));

initStateWithPrevTab(store);
// initMessageListener(store);

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <App />
        </Route>
        <Route path="/iframe">
          <IFrame />
        </Route>
      </Switch>
    </BrowserRouter>
  </Provider>,
    document.getElementById('root'),
);

registerServiceWorker();
