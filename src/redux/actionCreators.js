/**
 * Action creators for the application.
 */

/**
 * Sets socket to specific namespace.
 *
 * @param {string} url
 */
export const setSocket = (url) => {
	return {
		type: 'socket/set',
		url
	};
};

/**
 * Sets player ID after logging in.
 *
 * @param {string} playerId
 */
export const setPlayerId = (playerId) => {
	return {
		type: 'playerId/set',
		playerId
	};
};

export const setGameId = (gameId) => {
	return {
		type: 'gameId/set',
		gameId
	};
};

export const setHost = (boolean) => {
	return {
		type: 'host/set',
		boolean
	};
};

export const setStarted = (boolean) => {
	return {
		type: 'started/set',
		boolean
	};
};

export const setQuestion = (question) => {
	return {
		type: 'question/set',
		question
	};
};

export const decrementTimeLeft = () => {
	return {
		type: 'timeLeft/decrement',
	}
};

export const setAnswered = (boolean) => {
	return {
		type: 'answered/set',
		boolean
	}
}