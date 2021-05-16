import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setQuestion, setStarted } from '../redux/actionCreators';

import Timer from './Timer';
import Question from './Question';
import ChoiceContainer from './ChoiceContainer';
import AudioPlayer from './AudioPlayer';

export default function Game() {
	
	const socket = useSelector(state => state.socket);
	const { question, img } = useSelector(state => state.question);
	const host = useSelector(state => state.host);
	const started = useSelector(state => state.started);
	const dispatch = useDispatch();

	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ isLoadingQuestion, setIsLoadingQuestion ] = useState(true);
	const [ playAgain, setPlayAgain] = useState(false);

	// Socket sends request for server to send a question
	const startGame = () => {
		socket.emit('startGame');
		console.log('Game starts!');
	};

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (questionObject) => {
			console.log('New question');
			if (!isPlaying) {
				setIsPlaying(true);
			}
			if (!started) {
				dispatch(setStarted(true));
			}
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
			dispatch(setStarted(false));
			setPlayAgain(true);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket, dispatch, isPlaying, started]);

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

	} else if (host) {

		// Game hasn't started yet and you are host
		result = (
			<button onClick={startGame} className="start-game">
				{playAgain ? 'Play Again?' : 'Start Game'}
			</button>
		);
	} else if (started) {

		result = (
			<button className="start-game" disabled>
				In the middle of a question! Please wait.
			</button>
		);

	} else {

		// Game hasn't started yet and you are not host
		result = (
			<button className="start-game" disabled>
				Waiting for host to start game.
			</button>
		);
	}
	return <div className="Game">{result}</div>
}