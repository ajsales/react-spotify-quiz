// React packages
import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

// Redux packages
import { useSelector, useDispatch } from 'react-redux';
import { setPlayerId, setSocket } from '../redux/actionCreators';

// Spotify API helper
import grabSpotifyData from '../helper/spotifyGrabber';

/**
 * Callback page.
 */
export default function Callback() {

	const socket = useSelector(state => state.socket);
	const dispatch = useDispatch();

	const [ isPlayerLoaded, setIsPlayerLoaded ] = useState(false);

	// Sets socket namespace for page
	useEffect(() => {
		dispatch(setSocket('/callback'));
	}, [dispatch])

	// Fetches necessary Spotify API data for application
	useEffect(() => {

		// Moved async part to within the useEffect 
		const fetchSpotifyData = async (token) => {
			const { player, top50 } = await grabSpotifyData(token);

			// Socket sends data to server
			socket.emit('newPlayer', player, top50, () => {

				// After confirming that data is sent, page is re-rendered for a redirect
				setIsPlayerLoaded(true);
			});

			dispatch(setPlayerId(player.id));
		}

		// Grabs token for URL hash
		let token = window.location.hash.split('&')[0].split('=')[1];

		fetchSpotifyData(token);
	}, [socket, dispatch]);

	// Returns loading view if request is still in process
	if (isPlayerLoaded) {
		navigate('rooms', { replace: true });
		return null;
	} else {
		return (
			<div className="Callback">
				<h1>Loading Spotify data...</h1>
			</div>
		);
	}
}