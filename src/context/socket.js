import * as React from 'react';
import { io } from 'socket.io-client';

const server = process.env.NODE_ENV === 'production'
				? "https://react-spotify-quiz-back-end.herokuapp.com"
				: "http://localhost:8081";

export const socket = io(server, {
	withCredentials: true
});

export const SocketContext = React.createContext();