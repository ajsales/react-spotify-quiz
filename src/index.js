/**
 * Renders App to DOM.
 */

// React packages
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './components/App';

// Redux packages
import store from './redux/store';
import { Provider } from 'react-redux';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);