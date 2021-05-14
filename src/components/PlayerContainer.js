import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export default function PlayerContainer() {

	const socket = useSelector(state => state.socket);
	const gameId = useSelector(state => state.gameId);

	const [ players, setPlayers ] = useState([]);

	//Socket listeners
	useEffect(() => {
		socket.on('currentPlayers', (currentPlayers) => {
			setPlayers(currentPlayers);
		});
	}, [socket])

	const result = players.map(player => {
		return (<Player
			img={player.img}
			name={player.name}
			points={player.points}
			key={player.name}
		/>);
	});

	return (
		<div className="Player-Container">
			<h1 key={gameId}>Game: {gameId}</h1>
			<div>{result}</div>
		</div>
	);
}

function Player(props) {
	return (
		<div>
			<img src={props.img} alt={props.name} />
			<p>{props.name}: {props.points}</p>
		</div>
	);
}