import { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

export default function AudioPlayer() {

	const { song } = useSelector(state => state.question);
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

		// Pauses song when question is answered
		if (answered && audio.current) {
			audio.current.pause();
		} 

		// Plays song when question is given
		if (song && !answered) {
			playSong(song.preview);
		}
	}, [answered, song])

	return null;
}