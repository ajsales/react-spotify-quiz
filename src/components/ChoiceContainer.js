import React, { useState } from 'react';

import { useSelector } from 'react-redux';

export default function ChoiceContainer() {
	
	const socket = useSelector(state => state.socket);
	const { choices, answers } = useSelector(state => state.question);
	const [ answered, setAnswered ] = useState(false);

	const handleClick = (choice) => {
		setAnswered(true);
		socket.emit('answeredQuestion', answers.includes(choice), 30);
	};


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
			>
				{choice}
			</button>
		);
	});

	return <div>{choiceList}</div>
}