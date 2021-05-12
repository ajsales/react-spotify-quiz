import React, { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setQuestion, setAnswered } from '../redux/actionCreators';

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

	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ timeLeft, setTimeLeft ] = useState(null);

	const timer = useRef(null);
	const audio = useRef(new Audio());

	// Socket sends request for server to send a question
	const questionRequest = () => {
		socket.emit('questionRequest');
		console.log('Question request sended.');
	};

	const startTimer = () => {
		setTimeLeft(10);
		timer.current = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);
	};

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (questionObject) => {
			dispatch(setQuestion(questionObject));
			startTimer();
			setIsPlaying(true);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (timeLeft === 0 || answered) {
			clearInterval(timer.current);
			dispatch(setAnswered(true));
		}
	}, [timeLeft, dispatch, answered])

	useEffect(() => {
		if (song) {
			const newAudio = new Audio(song);
			newAudio.play();
			audio.current = newAudio;
		} 
	}, [song]);

	useEffect(() => {
		if (audio.current && answered) {
			audio.current.pause();
		}
	}, [answered])

	if (isPlaying) {
		return (
			<div>
				<button onClick={questionRequest} >Start Question</button>
				<p>{timeLeft}</p>
				<img src={img} alt={question} />
				<p>{question}</p>
				<ChoiceContainer />
			</div>
		);
	} else {
		return <button onClick={questionRequest} >Start Question</button>;
	}
}