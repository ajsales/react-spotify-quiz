import SpotifyWebApi from 'spotify-web-api-js';

const grabSpotifyData = async (token) => {
	const spotify = new SpotifyWebApi();
	spotify.setAccessToken(token);

	let player = {
		...await grabProfile(spotify),
		songs: await grabSongs(spotify),
		artists: await grabArtists(spotify)
	};

	let top50 = await grabTop50(spotify);

	return {player, top50};
};

const grabProfile = async (spotify) => {
	let response = await spotify.getMe();

	return {
		name: response.display_name,
		id: response.id,
		img: response.images
			? response.images[0].url
			: 'https://img.icons8.com/clouds/200/000000/spotify.png'
	}
};

const grabSongs = async (spotify) => {
	let songs = {};

	let response = await spotify.getMyTopTracks({limit: 10, time_range: 'short_term'});
	songs.recent = response.items.map((song) => pruneSongData(song));

	response = await spotify.getMyTopTracks({limit: 10, time_range: 'long_term'});
	songs.allTime = response.items.map((song) => pruneSongData(song));

	return songs;
};

const grabArtists = async (spotify) => {
	let artists = {};

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

	return artists;
}

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

	return top50;
}


const pruneSongData = (song) => {
	let artists = song.artists.map(artist => artist.name);
	artists = artists.filter(artist => !song.name.includes(artist));
	const trackObj = {
		img: song.album.images[0].url,
		title: song.name,
		artists: artists.join(', '),
		toString: song.name + ' by ' + artists.join(', '),
		preview: song.preview_url
	};
	return trackObj;
}

const pruneArtistData = (artist) => {
	return {
		img: artist.images[0].url,
		name: artist.name,
		songs: artist.songs.map((song) => pruneSongData(song))
	};
}

export default grabSpotifyData;