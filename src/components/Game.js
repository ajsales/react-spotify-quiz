import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setSocket } from '../redux/actionCreators';

export default function Game(props) {

	const socket = useSelector(state => state.socket);
	const dispatch = useDispatch();

	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ questionObj, setQuestionObj ] = useState({});
	let song = null;

	const questionRequest = () => {
		console.log('Question request sended.');
		socket.emit('questionRequest');
	}

	let result = [
		<h1 key={props.gameId}>Game: {props.gameId}</h1>,
		<button onClick={questionRequest} key="button">Start Question</button>
	];

	useEffect(() => {
		dispatch(setSocket('/game/' + props.gameId));
	}, [dispatch, props.gameId]);

	useEffect(() => {
		socket.on('newQuestion', (obj) => {
			setQuestionObj(obj);
			if (song) {
				song.pause();
			}
			song = new Audio(obj.song);
			song.play();
			setIsPlaying(true);
			console.log(obj.question);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket])

	if (isPlaying) {
		result.push(<img src={questionObj.img} key={questionObj.img} alt="Image"/>)
		result.push(<p key={questionObj.question} >{questionObj.question}</p>);
		let choices = [];
		for (let choice of questionObj.choices) {
			choices.push(<li key={choice}>{choice}</li>);
		}
		result.push(<ul key="choices">{choices}</ul>);
	}

	return <div>{result}</div>

	
}