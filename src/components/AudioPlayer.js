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
		if (answered && audio.current) {
			//console.log("Pausing:")
			audio.current.pause();
		} 

		if (song && !answered) {
			//console.log("Playing:")
			playSong(song.preview);
		}
	}, [answered, song])

	return null;
}