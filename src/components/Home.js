// React packages
import React from 'react';

// Spotify API request helper
import spotifyRequestUrl from '../helper/spotifyRequestUrl';

/**
 * Home page.
 */
export default function Home() {
	return (
		<a href={spotifyRequestUrl}>Login to Spotify</a>
	);
}