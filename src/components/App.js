import React, { useState } from 'react';
import { Router } from '@reach/router';

import Home from './Home';
import Game from './Game';
import Callback from './Callback';

import { io } from "socket.io-client";

export default function App() {

	const [ socket, setSocket ] = useState(io());

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