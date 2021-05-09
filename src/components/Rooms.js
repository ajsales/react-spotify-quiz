import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import { useSelector, useDispatch } from 'react-redux';
import { setSocket } from '../redux/actionCreators';

export default function Rooms() {

	const socket = useSelector(state => state.socket);
	const playerId = useSelector(state => state.playerId);
	const dispatch = useDispatch();

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
		socket.emit('newRoom', playerId, (gameId) => {
			handleJoinGame(gameId);
		});
	};

	useEffect(() => {
		dispatch(setSocket('/rooms'));
	}, [dispatch])

	useEffect(() => {
		socket.on('availableRooms', (rooms) => {
			setAvailableRooms(rooms);
			console.log('Available rooms: ', rooms);
		});

		return () => {
			socket.off('availableRooms');
		};
	}, [socket]);

	return (
		<div>
			<button onClick={handleCreateRoom} >Create Room</button>
			<form onSubmit={handleSubmit} >
				<input type="text" name="roomId" value={roomId} onChange={handleChange} />
				<input type="submit" value="Join Room" />
			</form>
		</div>
	);
}