// React packages
import React, { useEffect, useRef } from 'react';

// Redux packages
import { useSelector, useDispatch } from 'react-redux';
import { decrementTimeLeft } from '../redux/actionCreators';

/**
 * Timer component.
 */
export default function Timer() {

	const socket = useSelector(state => state.socket);
	const answered = useSelector(state => state.answered);
	const timeLeft = useSelector(state => state.timeLeft);
	const dispatch = useDispatch();

	const timer = useRef(null);

	// Starts timer at beginning of question
	useEffect(() => {
		const startTimer = () => {
			timer.current = setInterval(() => {
				dispatch(decrementTimeLeft());
			}, 1000);
		};

		if (!answered) {
			startTimer();
		}
	}, [socket, dispatch, answered]);

	// Ends timer when timer reaches 0 or
	// if question is answered
	useEffect(() => {
		if (timeLeft <= 0 || answered) {
			clearInterval(timer.current);
		}
	}, [timeLeft, answered])

	return <p className="timer">{timeLeft}</p>;
}