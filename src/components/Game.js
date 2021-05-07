import React, { useState, useContext } from 'react';
import { SocketContext } from '../context/socket';

export default function Game(props) {

	const socket = useContext(SocketContext);

	const [ isPlaying, setIsPlaying ] = useState(false);
	const [ questionObj, setQuestionObj ] = useState({});
	const questionRequest = () => {
		socket.emit('questionRequest');
	}

	socket.on('newQuestion', (obj) => {
		setQuestionObj(obj);
		setIsPlaying(true);
	})

	let result = [<h1 key={props.gameId}>Game: {props.gameId}</h1>];


	if (isPlaying) {
		const audio = new Audio(questionObj.song);
		audio.play();
		result.push(<img src={questionObj.img} key={questionObj.img} />)
		result.push(<p key={questionObj.question} >questionObj.question</p>);
		let choices = [];
		for (let choice of questionObj.choices) {
			choices.push(<li key={choice}>choice</li>);
		}
		result.push(<ul key="choices">choices</ul>);
	} else {
		result.push(<button onClick={questionRequest} key="button">Start Question</button>)
	}

	return <div>{result}</div>

	
}