import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import { useSelector, useDispatch } from 'react-redux';
import { setPlayerId, setSocket } from '../redux/actionCreators';

import grabSpotifyData from '../helper/spotifyGrabber';

export default function Callback() {

	const socket = useSelector(state => state.socket);
	const dispatch = useDispatch();

	const [ isPlayerLoaded, setIsPlayerLoaded ] = useState(false);

	useEffect(() => {
		dispatch(setSocket('/callback'));
	}, [dispatch])

	useEffect(() => {
		const fetchSpotifyData = async (token) => {
			const { player, top50 } = await grabSpotifyData(token);

			socket.emit('newPlayer', player, top50, () => {
				setIsPlayerLoaded(true);
			});

			dispatch(setPlayerId(player.id));
		}

		let token = window.location.hash.split('&')[0].split('=')[1];

		fetchSpotifyData(token);
	}, [socket, dispatch]);

	if (isPlayerLoaded) {
		navigate('rooms', { replace: true });
		return null;
	} else {
		return (
			<div>
				<h1>Loading Spotify data...</h1>
			</div>
		);
	}
}