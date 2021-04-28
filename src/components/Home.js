import React from 'react';

import spotifyRequestUrl from '../helper/spotifyRequestUrl';

export default function Home() {
	return (
		<a href={spotifyRequestUrl}>Login to Spotify</a>
	);
}