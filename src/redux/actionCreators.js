export const setSocket = (url) => {
	return {
		type: 'socket/set',
		url
	}
}

export const setPlayerId = (playerId) => {
	return {
		type: 'playerId/set',
		playerId
	}
}