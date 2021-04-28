import React, { useState } from 'react';
import { Router } from '@reach/router';

import Home from './Home';
import Game from './Game';
import Callback from './Callback';

import { io } from "socket.io-client";

export default function App() {

	const server = process.env.NODE_ENV === 'production'
					? "https://react-spotify-quiz-back-end.herokuapp.com"
					: "http://localhost:8081";
	const [ socket, setSocket ] = useState(io(server, {
		withCredentials: true
	}));

	const handlePlayer = (player) => {
		socket.emit('player', player);
	}

	return (
		<div>
			<Router>
				<Home path="/" />
				<Game path="game" />

				<Callback
					path="callback"
					onPlayer={handlePlayer}
				/>
			</Router>
		</div>
	);
}