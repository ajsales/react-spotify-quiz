// React packages
import React from 'react';
import { Router } from '@reach/router';

// Components
import Home from './Home';
import Rooms from './Rooms';
import GameContainer from './GameContainer';
import Callback from './Callback';

/**
 * Main application component.
 */
export default function App() {

	// Routing for each page is set up here
	return (
		<Router className="window" >
			<Home path="/" />
			<Rooms path="rooms" />
			<GameContainer path="game/:gameId" />

			<Callback path="callback" />
		</Router>
	);
}