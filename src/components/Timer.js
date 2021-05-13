import React, { useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setTimeLeft, decrementTimeLeft } from '../redux/actionCreators';

export default function Time() {

	const socket = useSelector(state => state.socket);
	const question = useSelector(state => state.question);
	const answered = useSelector(state => state.answered);
	const timeLeft = useSelector(state => state.timeLeft);
	const dispatch = useDispatch();

	const timer = useRef(null);

	useEffect(() => {

		const startTimer = () => {
			dispatch(setTimeLeft(10));
			timer.current = setInterval(() => {
				dispatch(decrementTimeLeft());
			}, 1000);
		};

		// Server sends a new question
		socket.on('startTimer', () => {
			startTimer();
		});

		return () => {
			socket.off('startTimer');
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (timeLeft <= 0 || answered) {
			clearInterval(timer.current);
		}
	}, [timeLeft, answered])

	useEffect(() => {
		clearInterval(timer.current);
	}, [question])

	return <p>{timeLeft}</p>;
}