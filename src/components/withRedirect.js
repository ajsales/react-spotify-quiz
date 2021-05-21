import React from 'react';
import { Redirect } from '@reach/router';

import { useSelector, useDispatch } from 'react-redux';
import { setPlayerId } from '../redux/actionCreators';

export default function withRedirect(WrappedComponent) {

	return function (props) {

		const playerId = useSelector(state => state.playerId);
		const dispatch = useDispatch();

		let savedPlayerId;

		if (playerId.length === 0) {
			savedPlayerId = localStorage.getItem('playerId');
			if (savedPlayerId === null) {
				return <Redirect to="/" state={{'message': 'You must re-login!'}} noThrow />;
			} else {
				dispatch(setPlayerId(savedPlayerId));
			}
		}
		return <WrappedComponent {...props}/>;
	}
}