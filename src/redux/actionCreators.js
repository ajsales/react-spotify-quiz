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

/**
 * Sets game ID when joining a room/game.
 *
 * @param {string} gameId
 */
export const setGameId = (gameId) => {
	return {
		type: 'gameId/set',
		gameId
	};
};


/**
 * Sets host to true to give host capabilities
 * to player if host (i.e. starting game).
 *
 * @param {boolean} boolean
 */
export const setHost = (boolean) => {
	return {
		type: 'host/set',
		boolean
	};
};


/**
 * Sets started to true if joining game
 * after it has already started
 *
 * @param {boolean} boolean
 */
export const setStarted = (boolean) => {
	return {
		type: 'started/set',
		boolean
	};
};

/**
 * Sets current question to display during
 * the game.
 *
 * @param {Object} question
 */
export const setQuestion = (question) => {
	return {
		type: 'question/set',
		question
	};
};

/**
 * Decrements time left for the question
 * by 1 second.
 */
export const decrementTimeLeft = () => {
	return {
		type: 'timeLeft/decrement',
	}
};

/**
 * Sets answered to true if current question
 * has been answered.
 *
 * @param {boolean} boolean
 */
export const setAnswered = (boolean) => {
	return {
		type: 'answered/set',
		boolean
	}
}