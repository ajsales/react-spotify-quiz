import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setHost } from '../redux/actionCreators';

export default function PlayerContainer() {

	const socket = useSelector(state => state.socket);
	const playerId = useSelector(state => state.playerId);
	const dispatch = useDispatch();

	const [ players, setPlayers] = useState([]);

	// Socket listeners
	useEffect(() => {

		// Server message to update players
		// (new player added, player left, points added, etc.)
		socket.on('currentPlayers', (currentPlayers, host) => {
			setPlayers(currentPlayers);
			dispatch(setHost(playerId === host));
		});

	}, [socket, dispatch, playerId])

	let result = [...players].sort((p1, p2) => {
		return p2.points - p1.points;
	});

	result = result.map(player => {
		return (<Player
			img={player.img}
			name={player.name}
			points={player.points}
			key={player.name}
		/>);
	});

	return (
		<div className="Player-Container">
			<div>{result}</div>
		</div>
	);
}

function Player(props) {
	return (
		<div className="player">
			<img src={props.img} alt={props.name} />
			<span className="name">{props.name}</span>
			<span className="points">{props.points}</span>
		</div>
	);
}