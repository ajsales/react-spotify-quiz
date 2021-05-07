import React, { useState } from 'react';
import { Router } from '@reach/router';

import Home from './Home';
import Rooms from './Rooms';
import Game from './Game';
import Callback from './Callback';

import { SocketContext, socket } from '../context/socket';

export default function App() {

	const [ playerId, setPlayerId ] = useState('');
	const handleLogin = (id) => {
		setPlayerId(id);
	};

	return (
		<SocketContext.Provider value={socket}>
			<Router>
				<Home path="/" />
				<Rooms path="rooms" playerId={playerId} />
				<Game path="game/:gameId" playerId={playerId} />

				<Callback path="callback" onLogin={handleLogin} />
			</Router>
		</SocketContext.Provider>
	);
}