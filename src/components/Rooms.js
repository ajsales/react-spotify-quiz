import React, { useState, useEffect, useContext } from 'react';
import { navigate } from '@reach/router';
import { SocketContext } from '../context/socket';

export default function Rooms(props) {

	const socket = useContext(SocketContext);

	const [ availableRooms, setAvailableRooms ] = useState([]);
	const [ roomId, setRoomId ] = useState('');

	const handleChange = (event) => {
		setRoomId(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (availableRooms.includes(roomId)) {
			handleJoinGame(roomId);
		} else {
			alert('Room '+ roomId + " doesn't exist.");
		}
	};

	const handleJoinGame = (gameId) => {
		navigate('/game/' + gameId);
	};

	const handleCreateRoom = () => {
		socket.emit('newRoom', props.playerId);
	};

	socket.on('availableRooms', (rooms) => {
		setAvailableRooms(rooms);
		console.log('Available rooms: ', rooms);
	});

	socket.on('joinGame', (gameId) => {
		handleJoinGame(gameId);
	});

	useEffect(() => {
		socket.emit('roomsRequest');
	}, [socket]);

	return (
		<div>
			<button onClick={handleCreateRoom}>Create Room</button>
			<form onSubmit={handleSubmit}>
				<input type="text" name="roomId" value={roomId} onChange={handleChange} />
				<input type="submit" value="Join Room" />
			</form>
		</div>
	);
}