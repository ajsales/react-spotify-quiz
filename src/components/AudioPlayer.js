// React packages
import { useEffect, useRef } from 'react';

// Redux packages
import { useSelector } from 'react-redux';

// Media imports
import timerAudio from '../media/timer.wav';

/**
 * Component in charge of playing song for current
 * question. 
 */
export default function AudioPlayer() {

	const { song } = useSelector(state => state.question);
	const answered = useSelector(state => state.answered);

	const audio = useRef(null);

	const playSong = (url) => {
		// Pauses current audio if not already.
		if (audio.current) {
			audio.current.pause();
		}

		// Checks to see if valid preview url
		// (not all songs on Spotify have previews)
		let newAudio;
		if (url.length > 0) {
			newAudio = new Audio(url);
		} else {

			// Sets audio to generic background music
			// if url is invalid
			newAudio = new Audio(timerAudio);
		}

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