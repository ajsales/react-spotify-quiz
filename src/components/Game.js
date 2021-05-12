import React, { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setQuestion } from '../redux/actionCreators';

import ChoiceContainer from './ChoiceContainer';

export default function Game() {
	
	const socket = useSelector(state => state.socket);
	const {
		question,
		song,
		img
	} = useSelector(state => state.question);
	const answered = useSelector(state => state.answered);
	const dispatch = useDispatch();

	const [ isPlaying, setIsPlaying] = useState(false);

	const audio = useRef(new Audio());

	// Socket sends request for server to send a question
	const questionRequest = () => {
		socket.emit('questionRequest');
		console.log('Question request sended.');
	};

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (questionObject) => {
			dispatch(setQuestion(questionObject));
			setIsPlaying(true);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (audio.current) {
			audio.current.pause();
		}
		if (song) {
			const newAudio = new Audio(song);
			newAudio.play();
			audio.current = newAudio;
		} 
	}, [song]);

	if (isPlaying) {

		return (
			<div>
				<button onClick={questionRequest} >Start Question</button>
				<img src={img} alt={question} />
				<p>{question}</p>
				<ChoiceContainer />
			</div>
		);
	} else {
		return <button onClick={questionRequest} >Start Question</button>;
	}
}