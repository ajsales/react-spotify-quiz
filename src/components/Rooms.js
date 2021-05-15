// React packages
import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

// Redux packages
import { useSelector, useDispatch } from 'react-redux';
import { setSocket } from '../redux/actionCreators';

import spotifyLogo from '../media/spotify-logo.png';

/**
 * Rooms page.
 */
export default function Rooms() {

	const socket = useSelector(state => state.socket);
	const playerId = useSelector(state => state.playerId);
	const dispatch = useDispatch();

	const [ availableRooms, setAvailableRooms ] = useState([]);
	const [ roomId, setRoomId ] = useState('');

	// Handles change within Room ID input form
	const handleChange = (event) => {
		setRoomId(event.target.value);
	};

	// Handles submitting Room ID form
	const handleSubmit = (event) => {
		event.preventDefault();

		if (availableRooms.includes(roomId)) {
			handleJoinGame(roomId);
		} else {
			alert('Room '+ roomId + " doesn't exist.");
		}
	};

	// Navigates to the specific game page
	const handleJoinGame = (gameId) => {
		navigate('/game/' + gameId);
	};

	// Socket sends request to server to create new room/game
	const handleCreateRoom = () => {
		socket.emit('newRoom', playerId, (gameId) => {

			// After room/game is created, player is redirected to that page
			handleJoinGame(gameId);
		});
	};

	// Sets socket namespace for page
	useEffect(() => {
		dispatch(setSocket('/rooms'));
	}, [dispatch])

	// Socket listeners
	useEffect(() => {

		// Server sends the list of available rooms
		socket.on('availableRooms', (rooms) => {
			setAvailableRooms(rooms);
			console.log('Available rooms: ', rooms);
		});

		return () => {
			socket.off('availableRooms');
		};
	}, [socket]);

	return (
		<div className="Rooms" >
			<h1>
				Friends Quiz for 
				<img className="spotify-logo" src={spotifyLogo} alt="Spotify logo" />
			</h1>
			
			<button onClick={handleCreateRoom} ><p>Create Room</p></button>
			<form onSubmit={handleSubmit} >
				<input
					type="text"
					name="roomId"
					value={roomId}
					onChange={handleChange}
					placeholder="Room ID"
				/>
				<input type="submit" value="Join Room" />
			</form>
		</div>
	);
}