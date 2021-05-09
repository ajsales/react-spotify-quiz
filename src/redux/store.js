import { createStore } from 'redux';
import { io } from 'socket.io-client';

const server = process.env.NODE_ENV === 'production'
	? "https://react-spotify-quiz-back-end.herokuapp.com"
	: "http://localhost:8081";

const initialState = {
	server,
	socket: io(server, {withCredentials: true}),
	playerId: ''
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'socket/set':
			return {
				...state,
				socket: io(server + action.url, {withCredentials: true})
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