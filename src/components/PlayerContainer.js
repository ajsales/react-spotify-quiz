import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export default function PlayerContainer() {

	const socket = useSelector(state => state.socket);

	const [ players, setPlayers] = useState([]);

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