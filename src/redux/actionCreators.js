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
	}
}

/**
 * Sets player ID after logging in.
 *
 * @param {string} playerId
 */
export const setPlayerId = (playerId) => {
	return {
		type: 'playerId/set',
		playerId
	}
}