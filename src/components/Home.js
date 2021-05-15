// React packages
import React from 'react';

// Spotify API request helper
import spotifyRequestUrl from '../helper/spotifyRequestUrl';

// Media imports
import spotifyLogo from '../media/spotify-logo.png';

/**
 * Home page.
 */
export default function Home() {

	// Redirects user for Spotify API token request
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