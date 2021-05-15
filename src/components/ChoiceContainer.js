import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setAnswered } from '../redux/actionCreators';

export default function ChoiceContainer() {
	
	const socket = useSelector(state => state.socket);
	const { choices, answers } = useSelector(state => state.question);
	const timeLeft = useSelector(state => state.timeLeft);
	const answered = useSelector(state => state.answered);
	const dispatch = useDispatch();

	const handleClick = (choice) => {
		dispatch(setAnswered(true));
		socket.emit('answeredQuestion', answers.includes(choice), timeLeft, choice);
	};

	useEffect(() => {
		if (timeLeft <= 0) {
			dispatch(setAnswered(true));
			socket.emit('answeredQuestion', false, 0, null);
		}
	}, [dispatch, socket, timeLeft])


	const choiceList = choices.map(choice => {
		let style = 'choice';
		if (answered) {
			style.concat(answers.includes(choice)
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