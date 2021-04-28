import React, { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

import SpotifyWebApi from 'spotify-web-api-js';

export default function Callback(props) {
	const [ spotify ] = useState(new SpotifyWebApi());
	const [ isPlayerLoaded, setIsPlayerLoaded ] = useState(false);

	useEffect(() => {
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
			if (response.images) {
				player.image = response.images[0].url;
			} else {
				player.image = 'https://img.icons8.com/clouds/200/000000/spotify.png';
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

			props.onPlayer(player);
			console.log(player);
			setIsPlayerLoaded(true);
		};

		let token = window.location.hash.split('&')[0].split('=')[1];

		spotify.setAccessToken(token);

		grabPlayer();
	}, []);

	if (isPlayerLoaded) {
		navigate('game', { replace: true });
		return null;
	} else {
		return (
			<div className="home">
				<h1 className="home-title">Loading Spotify data...</h1>
			</div>
		);
	}
}