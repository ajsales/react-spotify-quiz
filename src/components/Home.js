// React packages
import React, { useEffect } from 'react';

// Spotify API request helper
import spotifyRequestUrl from '../helper/spotifyRequestUrl';

// Media imports
import spotifyLogo from '../media/spotify-logo.png';

/**
 * Home page.
 */
export default function Home(props) {

	// Redirects user for Spotify API token request
	const handleClick = () => {
		window.location.href = spotifyRequestUrl;
	}

	const locationState = props.location.state;

	useEffect(() => {
		if (locationState) {
			const message = locationState.message;
			if (message.length > 0) {
				alert(message);
			}
		}
	}, [locationState])

	return (
		<div className="Home">
			<h1>
				Friends Quiz for 
				<img className="spotify-logo" src={spotifyLogo} alt="Spotify logo" />
			</h1>
	
			<button onClick={handleClick}>
				<p>Login to Spotify</p>
			</button>
		</div>
	);
}