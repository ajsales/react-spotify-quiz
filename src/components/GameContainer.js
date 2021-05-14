// React packages
import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

// Redux pages
import { useSelector, useDispatch } from 'react-redux';
import { setSocket, setGameId } from '../redux/actionCreators';

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


	// Sets socket namespace for page
	useEffect(() => {
		dispatch(setGameId(props.gameId));
		dispatch(setSocket('/game/' + props.gameId));
	}, [dispatch, props.gameId]);

	useEffect(() => {
		socket.emit('joinGame', playerId, () => {
			console.log('You joined the game!');
		});
	}, [socket, playerId]);

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