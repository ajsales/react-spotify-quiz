// React packages
import React, { useEffect } from 'react';
import { navigate } from '@reach/router';
import ReactTooltip from 'react-tooltip';

// Redux pages
import { useSelector, useDispatch } from 'react-redux';
import { setSocket, setPlayerId, setGameId } from '../redux/actionCreators';

import Game from './Game';
import PlayerContainer from './PlayerContainer';

/**
 * Games page. 
 */
export default function GameContainer(props) {

	const socket = useSelector(state => state.socket);
	const playerId = useSelector(state => state.playerId);
	const gameId = useSelector(state => state.gameId);
	const dispatch = useDispatch();

	const redirectToHome = () => {
		navigate('/', {state: {
			message: 'You must re-login!'
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
				if (response) {
					redirectToHome();
				}
				console.log('You joined the game!');
			});
		}
	}, [socket, playerId]);

	if (playerId.length === 0) {
		const savedPlayerId = localStorage.getItem('playerId');
		if (savedPlayerId === null) {
			console.log('should be doing this');
			redirectToHome();
		} else {
			dispatch(setPlayerId(savedPlayerId));
		}
	}

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