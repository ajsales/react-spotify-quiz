/**
 * Creates Redux store for application.
 */

import { createStore } from 'redux';
import { io } from 'socket.io-client';

// Choose appropriate server
const server = process.env.NODE_ENV === 'production'
	? "https://react-spotify-quiz-back-end.herokuapp.com"
	: "http://localhost:8081";

// Initial Redux state for application
const initialState = {
	socket: io(server),
	playerId: ''
};

// Reducer for Redux store
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'socket/set':
			return {
				...state,
				socket: io(server + action.url)
			};

		case 'playerId/set':
			return {
				...state,
				playerId: action.playerId
			};

		default:
			return state
	}
};

const store = createStore(reducer);
export default store;