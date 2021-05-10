/**
 * Returns URL for Spoitfy API token request
 */

// Sets appropriate URI to be redirected after the request
let redirect_uri;
if (window.location.host === 'localhost:3000') {
	redirect_uri = 'http://localhost:3000/callback';
} else {
	redirect_uri = 'https://react-spotify-quiz.herokuapp.com/callback';
}

// Request params
const params = {
	client_id: '08d9ae27bdb345cea1cfdeb643f4c861',
	redirect_uri: redirect_uri,
	scope: 'user-read-private user-top-read',
	response_type: 'token'
}

// Helper function to turn params into query string
const toQueryString = (params) => {
	var query = [];
	for (var key in params) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
	}
	return query.join('&')
}

const spotifyRequestUrl = 'https://accounts.spotify.com/authorize?' + toQueryString(params);
export default spotifyRequestUrl;