/**
 * Grabs the necessary data from the Spotify API for the application
 */

import SpotifyWebApi from 'spotify-web-api-js';

/**
 * Main function to grab the necessary Spotify data.
 * This is what gets exported.
 *
 * @param {string} token The token to access the Spotify API
 */
const grabSpotifyData = async (token) => {
	const spotify = new SpotifyWebApi();
	spotify.setAccessToken(token);

	// Player data to be turned into Player instance
	let player = {
		...await grabProfile(spotify),
		songs: await grabSongs(spotify),
		artists: await grabArtists(spotify)
	};

	// Extra Top 50 data
	let top50 = await grabTop50(spotify);

	return {player, top50};
};

/**
 * Grabs player's profile info
 *
 * @param {API} spotify The spotify API
 */
const grabProfile = async (spotify) => {
	let response = await spotify.getMe();

	/**
	 * @property {string} name Player's name
	 * @property {string} id Player's Spotify ID
	 * @property {string} img URL of player's profile image
	 */
	return {
		name: response.display_name,
		id: response.id,
		img: response.images && response.images.length > 0
			? response.images[0].url
			: 'https://img.icons8.com/clouds/200/000000/spotify.png'
	}
};

/**
 * Grabs player's Top 10 favorite Songs (recent and all-time)
 *
 * @param {API} spotify The spotify API
 */
const grabSongs = async (spotify) => {
	let songs = {};

	let response = await spotify.getMyTopTracks({limit: 10, time_range: 'short_term'});
	songs.recent = response.items.map((song) => pruneSongData(song));

	response = await spotify.getMyTopTracks({limit: 10, time_range: 'long_term'});
	songs.allTime = response.items.map((song) => pruneSongData(song));

	/**
	 * @property {Object[]} recent Player's recent Top 10 songs (within the past 2 weeks)
	 * @property {Object[]} allTime Player's all-time Top 10 songs
	 */
	return songs;
};

/**
 * Grabs player's Top 10 favorite Artists (recent and all-time)
 *
 * @param {API} spotify The spotify API
 */
const grabArtists = async (spotify) => {
	let artists = {};

	// Nested promises and asyncs because 2 responses are made: 1 for the artist, and
	// 1 for the artist's top songs
	let response = await spotify.getMyTopArtists({limit: 10, time_range: 'short_term'})
	artists.recent = await Promise.all(response.items.map(async (artist) => {
		response = await spotify.getArtistTopTracks(artist.id, 'US');
		return pruneArtistData({...artist, songs: response.tracks.slice(0, 5)});
	}));

	response = await spotify.getMyTopArtists({limit: 10, time_range: 'long_term'})
	artists.allTime = await Promise.all(response.items.map(async (artist) => {
		response = await spotify.getArtistTopTracks(artist.id, 'US');
		return pruneArtistData({...artist, songs: response.tracks.slice(0, 5)});
	}));

	/**
	 * @property {Object[]} recent Player's recent Top 10 artists (within the past 2 weeks)
	 * @property {Object[]} allTime Player's all-time Top 10 artists
	 */
	return artists;
}

/**
 * Grabs extra Top 50 data to be used for games with less players
 *
 * @param {API} spotify The spotify API
 */
const grabTop50 = async (spotify) => {
	let top50 = {};

	let response = await spotify.getCategoryPlaylists('toplists', {country: 'US'});
	let playlist = response.playlists.items.filter(p => p.name === 'Top 50 - USA')[0];
	response = await spotify.getPlaylistTracks(playlist.id);
	top50.songs = response.items.map(song => song.track);

	top50.artists = await Promise.all(top50.songs.map(async (song) => {
		let artistId = song.artists[0].id;
		let artist = await spotify.getArtist(artistId);
		return pruneArtistData({...artist, songs: [song]});
	}));
	top50.songs = top50.songs.map(song => pruneSongData(song));

	/**
	 * @property {Object[]} songs Songs from "Top 50 - USA" playlist
	 * @property {Object[]} artists Artists of the above songs
	 */
	return top50;
}

/**
 * Song object is pruned for only the necessary information
 *
 * @param {Object} song The song data to be pruned
 */
const pruneSongData = (song) => {

	// Removes artists already featured in song title
	let artists = song.artists.map(artist => artist.name);
	artists = artists.filter(artist => !song.name.includes(artist));

	/**
	 * @property {string} img Album image of song
	 * @property {string} title Title of the song
	 * @property {string} artists Artists featured on song
	 * @property {string} toString Title+artists (used later for equality checks)
	 * @property {string} preview URL of 30-second song preview
	 */

	const img = song.album.images && song.album.images.length > 0
		? song.album.images[0].url
		: 'https://img.icons8.com/clouds/200/000000/spotify.png';

	const trackObj = {
		img,
		title: song.name,
		artists: artists.join(', '),
		toString: song.name + ' by ' + artists.join(', '),
		preview: song.preview_url
	};
	return trackObj;
}

/**
 * Artist object is pruned for only the necessary information
 *
 * @param {Object} artist The artist data to be pruned
 */
const pruneArtistData = (artist) => {

	/**
	 * @property {string} img Profile image of artist
	 * @property {string} name Name of artist
	 * @property {Object} songs All-time Top 10 songs of artist
	 */
	const img = artist.images && artist.images.length > 0
		? artist.images[0].url
		: 'https://img.icons8.com/clouds/200/000000/spotify.png';

	return {
		img,
		name: artist.name,
		songs: artist.songs.map((song) => pruneSongData(song))
	};
}

export default grabSpotifyData;