// React packages
import React from 'react';

// Spotify API request helper
import spotifyRequestUrl from '../helper/spotifyRequestUrl';

import spotifyLogo from '../images/spotify-logo.png';

/**
 * Home page.
 */
export default function Home() {

	const handleClick = () => {
		window.location.href = spotifyRequestUrl;
	}

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