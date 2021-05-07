import React, { useState, useEffect, useContext } from 'react';
import { navigate } from '@reach/router';
import { SocketContext } from '../context/socket';

import SpotifyWebApi from 'spotify-web-api-js';

export default function Callback(props) {
	const [ isPlayerLoaded, setIsPlayerLoaded ] = useState(false);
	const socket = useContext(SocketContext);
	const { onLogin } = props;

	useEffect(() => {
		const spotify = new SpotifyWebApi();
		const pruneSongData = (song) => {
			let artists = song.artists.map(artist => artist.name);
			artists = artists.filter(artist => !song.name.includes(artist));
			const trackObj = {
				img: song.album.images[0].url,
				title: song.name,
				artists: artists.join(', '),
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

		const grabPlayer = async () => {
			let player = {};

			let response;
			response = await spotify.getMe();
			player.name = response.display_name;
			player.id = response.id;
			if (response.images) {
				player.img = response.images[0].url;
			} else {
				player.img = 'https://img.icons8.com/clouds/200/000000/spotify.png';
			}

			player.songs = {};

			response = await spotify.getMyTopTracks({limit: 10, time_range: 'short_term'});
			player.songs.recent = response.items.map((song) => pruneSongData(song));

			response = await spotify.getMyTopTracks({limit: 10, time_range: 'long_term'});
			player.songs.allTime = response.items.map((song) => pruneSongData(song));

			player.artists = {};

			response = await spotify.getMyTopArtists({limit: 10, time_range: 'short_term'})
			player.artists.recent = await Promise.all(response.items.map(async (artist) => {
				response = await spotify.getArtistTopTracks(artist.id, 'US');
				return pruneArtistData({...artist, songs: response.tracks.slice(0, 5)});
			}));

			response = await spotify.getMyTopArtists({limit: 10, time_range: 'long_term'})
			player.artists.allTime = await Promise.all(response.items.map(async (artist) => {
				response = await spotify.getArtistTopTracks(artist.id, 'US');
				return pruneArtistData({...artist, songs: response.tracks.slice(0, 5)});
			}));

			let top50 = {};

			response = await spotify.getCategoryPlaylists('toplists', {country: 'US'});
			let playlist = response.playlists.items.filter(p => p.name === 'Top 50 - USA')[0];
			response = await spotify.getPlaylistTracks(playlist.id);
			top50.songs = response.items.map(song => song.track);

			top50.artists = await Promise.all(top50.songs.map(async (song) => {
				let artistId = song.artists[0].id;
				let artist = await spotify.getArtist(artistId);
				return pruneArtistData({...artist, songs: [song]});
			}));
			top50.songs = top50.songs.map(song => pruneSongData(song));

			socket.emit('newPlayer', player);
			socket.emit('extraData', top50);
			onLogin(player.id);
		};

		let token = window.location.hash.split('&')[0].split('=')[1];

		spotify.setAccessToken(token);

		grabPlayer();
		setIsPlayerLoaded(true);
	}, [socket, onLogin]);

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