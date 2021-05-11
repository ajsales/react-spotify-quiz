import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export default function PlayerContainer() {

	const socket = useSelector(state => state.socket);

	const [ players, setPlayers ] = useState([]);

	//Socket listeners
	useEffect(() => {
		socket.on('currentPlayers', (currentPlayers) => {
			setPlayers(currentPlayers);
			console.log(currentPlayers.map(p => p.name));
		})
	}, [socket])

	const result = players.map(player => {
		return <img src={player.img} alt={player.name} key={player.name}/>;
	});

	return <div>{result}</div>;
}