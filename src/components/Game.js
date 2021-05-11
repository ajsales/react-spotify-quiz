import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

export default function Game() {
	
	const socket = useSelector(state => state.socket);

	const [ isPlaying, setIsPlaying] = useState(false);
	const [ questionObj, setQuestionObj ] = useState({});
	let song = null;

	// Socket sends request for server to send a question
	const questionRequest = () => {
		socket.emit('questionRequest');
		console.log('Question request sended.');
	}

	const playQuestion = (obj) => {
		setQuestionObj(obj);
		playSong(obj.song);
		setIsPlaying(true);
		console.log(obj.question);
	}

	const playSong = (url) => {
		if (song) {
			song.pause();
		}
		song = new Audio(url);
		song.play();
	}

	//Socket listeners
	useEffect(() => {

		// Server sends a new question
		socket.on('newQuestion', (obj) => {
			playQuestion(obj);
		});

		return () => {
			socket.off('newQuestion');
		};
	}, [socket])

	if (isPlaying) {
		let choices = [];
		for (let choice of questionObj.choices) {
			choices.push(<li key={choice}>{choice}</li>);
		}

		return (
			<div>
				<button onClick={questionRequest} >Start Question</button>
				<img src={questionObj.img} alt="Image"/>
				<p>{questionObj.question}</p>
				<ul key="choices">{choices}</ul>
			</div>
		);
	} else {
		return <button onClick={questionRequest} >Start Question</button>;
	}
};