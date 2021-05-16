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
	playerId: '',
	gameId: '',
	host: false,
	started: false,
	question: {},
	timeLeft: 30,
	answered: false
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

		case 'gameId/set':
			return {
				...state,
				gameId: action.gameId
			}

		case 'host/set':
			return {
				...state,
				host: action.boolean
			}

		case 'started/set':
			return {
				...state,
				started: action.boolean
			}

		case 'question/set':
			return {
				...state,
				question: action.question,
				timeLeft: 30,
				answered: false
			}

		case 'timeLeft/decrement':
			return {
				...state,
				timeLeft: state.timeLeft - 1
			}

		case 'answered/set':
			return {
				...state,
				answered: action.boolean
			}

		default:
			return state
	}
};

const store = createStore(reducer);
export default store;