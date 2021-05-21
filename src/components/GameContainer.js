// React packages
import React, { useEffect } from 'react';
import { navigate } from '@reach/router';
import ReactTooltip from 'react-tooltip';

// Redux packages
import { useSelector, useDispatch } from 'react-redux';
import { setSocket, setGameId, setStarted } from '../redux/actionCreators';

// Components
import Game from './Game';
import PlayerContainer from './PlayerContainer';

import withRedirect from './withRedirect';

/**
 * Games page. 
 */
function GameContainer(props) {

	const socket = useSelector(state => state.socket);
	const playerId = useSelector(state => state.playerId);
	const gameId = useSelector(state => state.gameId);
	const dispatch = useDispatch();

	// Redirects to Home page
	const redirectToHome = () => {
		navigate('/', {state: {
			message: 'You must re-login!'
		}});
	}

	// Redirects to Rooms page
	const redirectToRooms = () => {
		navigate('/rooms', {state: {
			message: 'Room does not exist!'
		}});
	}

	// Sets socket namespace for page
	useEffect(() => {
		dispatch(setGameId(props.gameId));
		dispatch(setSocket('/game/' + props.gameId));
	}, [dispatch, props.gameId]);

	// Sends message to server to add player to game
	useEffect(() => {
		if (playerId.length > 0) {
			socket.emit('joinGame', playerId, (response) => {

				// If player data couldn't be found on server
				if (response === 'You must re-login!') {
					redirectToHome();
				} else if (response) {
					dispatch(setStarted(true));
				}

				console.log('You joined the game!');
			});
		}
	}, [socket, playerId, dispatch]);

	// Socket listeners
	useEffect(() => {

		// Server message to redirect to Rooms page
		socket.on('redirectToRooms', () => {
			redirectToRooms();
		})

		return () => {
			socket.off('redirectToRooms');
		}
	}, [socket])

	// Grabs a locally saved player ID if not currently
	// in Redux (in case of page refreshes); refreshes if none
	/*
	if (playerId.length === 0) {
		const savedPlayerId = localStorage.getItem('playerId');
		if (savedPlayerId === null) {
			redirectToHome();
		} else {
			dispatch(setPlayerId(savedPlayerId));
		}
	}
	*/

	return (
		<div className="Game-Container">
			<Game />
			<button
				className="game-id"
				onClick={() => navigator.clipboard.writeText(gameId)}
				data-tip="Copy to clipboard"
			>
				<p>ROOM ID: {gameId}</p>
			</button>
			<ReactTooltip />
			<PlayerContainer />
		</div>
	);

	
}

export default withRedirect(GameContainer);