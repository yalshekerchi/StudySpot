import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { MomentUtils } from 'material-ui-pickers/utils/moment-utils';
import 'typeface-roboto';
import './index.css';

import App from './components/App';
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.querySelector('#root')
);
