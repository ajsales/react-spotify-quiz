import React from 'react';
import { Router } from '@reach/router';

import Home from './Home';
import Rooms from './Rooms';
import Game from './Game';
import Callback from './Callback';

export default function App() {

	return (
		<Router>
			<Home path="/" />
			<Rooms path="rooms" />
			<Game path="game/:gameId" />

			<Callback path="callback" />
		</Router>
	);
}