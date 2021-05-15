import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setQuestion } from '../redux/actionCreators';

import Timer from './Timer';
import Question from './Question';
import ChoiceContainer from './ChoiceContainer';
import AudioPlayer from './AudioPlayer';

export default function Game() {
	
	const socket = useSelector(state => state.socket);
	const { question, img } = useSelector(state => state.question);
	const dispatch = useDispatch();

	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ isLoadingQuestion, setIsLoadingQuestion ] = useState(true);
	const [ playAgain, setPlayAgain] = useState(false);

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

			// Gives player a moment to notice that there's a new question
			setTimeout(() => {
				dispatch(setQuestion(questionObject));
				setIsLoadingQuestion(false);
			}, 3000);
		});

		// Server ends game
		socket.on('endGame', () => {
			setIsPlaying(false);
			setPlayAgain(true);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch]);

	let result;

	if (isPlaying && isLoadingQuestion) {

		// Between questions
		result = <h2 className="loading">Loading question...</h2>;

	} else if (isPlaying) {

		// While a question is loaded
		result = (
			<div className="playing">
				<Timer />
				<img src={img} alt={question} className="image"/>
				<Question />
				<ChoiceContainer />

				<AudioPlayer />
			</div>
		);

	} else {

		// Game hasn't started yet
		result = (
			<button onClick={startGame} className="start-game">
				{playAgain ? 'Play Again?' : 'Start Game'}
			</button>
		);

	}
	return <div className="Game">{result}</div>
}