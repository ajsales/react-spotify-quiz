import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setAnswered } from '../redux/actionCreators';

import correctAnswer from '../media/correct-answer.wav';
import wrongAnswer from '../media/wrong-answer.wav';

export default function ChoiceContainer() {
	
	const socket = useSelector(state => state.socket);
	const { choices, answers } = useSelector(state => state.question);
	const timeLeft = useSelector(state => state.timeLeft);
	const answered = useSelector(state => state.answered);
	const dispatch = useDispatch();

	const handleClick = (choice) => {
		dispatch(setAnswered(true));
		let correct = answers.includes(choice);
		playAnswerAudio(correct);
		socket.emit('answeredQuestion', correct, timeLeft, choice);
	};

	const playAnswerAudio = (correct) => {
		let audio = correct
			? new Audio(correctAnswer)
			: new Audio(wrongAnswer);

		audio.play(); 
	}

	useEffect(() => {
		if (timeLeft <= 0) {
			dispatch(setAnswered(true));
			playAnswerAudio(false);
			socket.emit('answeredQuestion', false, 0, null);
		}
	}, [dispatch, socket, timeLeft])


	const choiceList = choices.map(choice => {
		let style = 'choice';
		if (answered) {
			style = style.concat(answers.includes(choice)
				? ' correct'
				: ' wrong');
		}

		return (
			<button
				key={choice}
				onClick={() => handleClick(choice)}
				className={style}
				disabled={answered}
			>
				{choice}
			</button>
		);
	});

	return <div className="choice-container">{choiceList}</div>
}