import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setQuestion } from '../redux/actionCreators';

import ChoiceContainer from './ChoiceContainer';
import Timer from './Timer';
import AudioPlayer from './AudioPlayer';

export default function Game() {
	
	const socket = useSelector(state => state.socket);
	const { question, img } = useSelector(state => state.question);
	const dispatch = useDispatch();

	const [ isPlaying, setIsPlaying ] = useState(false);

	// Socket sends request for server to send a question
	const startGame = () => {
		socket.emit('startGame');
		console.log('Game starts!');
	};

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (questionObject) => {
			dispatch(setQuestion(questionObject));
			setIsPlaying(true);
		});

		socket.on('endGame', () => {
			setIsPlaying(false);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch]);

	if (isPlaying) {
		return (
			<div>
				<Timer />
				<img src={img} alt={question} />
				<p>{question}</p>
				<ChoiceContainer />

				<AudioPlayer />
			</div>
		);
	} else {
		return <button onClick={startGame} >Start Question</button>;
	}
}