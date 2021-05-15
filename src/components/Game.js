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
	const [ isLoadingQuestion, setIsLoadingQuestion ] = useState(true);

	// Socket sends request for server to send a question
	const startGame = () => {
		socket.emit('startGame');
		setIsPlaying(true);
		console.log('Game starts!');
	};

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (questionObject) => {
			console.log('New question');
			setIsLoadingQuestion(true);
			setTimeout(() => {
				dispatch(setQuestion(questionObject));
				setIsLoadingQuestion(false);
			}, 3000);
		});

		socket.on('endGame', () => {
			setIsPlaying(false);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch]);

	let result;
	if (isPlaying && isLoadingQuestion) {
		result = <h2 className="loading">Loading question...</h2>;
	} else if (isPlaying) {
		result = (
			<div className="playing">
				<Timer />
				<img src={img} alt={question} className="image"/>
				<p className="question">{question}</p>
				<ChoiceContainer />

				<AudioPlayer />
			</div>
		);
	} else {
		result = <button onClick={startGame} className="start-game">Start Game</button>;
	}
	return <div className="Game">{result}</div>
}