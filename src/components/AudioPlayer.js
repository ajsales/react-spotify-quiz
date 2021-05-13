import { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

export default function AudioPlayer() {

	const socket = useSelector(state => state.socket);
	const answered = useSelector(state => state.answered);

	const audio = useRef(null);

	const playSong = (url) => {
		if (audio.current) {
			audio.current.pause();
		}

		const newAudio = new Audio(url);
		newAudio.play();
		audio.current = newAudio;
	}

	useEffect(() => {

		socket.on('playSong', (song) => {
			playSong(song);
		});

		return () => {
			socket.off('playSong');
		};
	}, [socket]);

	useEffect(() => {
		if (answered && audio.current) {
			audio.current.pause();
		} 
	}, [answered])

	return null;
}