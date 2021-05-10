import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import store from './redux/store';
import { Provider } from 'react-redux';

/**
 * Renders App to DOM.
 */
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);