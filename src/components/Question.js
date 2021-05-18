// React packages
import React from 'react';

// Redux packages
import { useSelector } from 'react-redux';

// Helper function
import reactStringReplace from 'react-string-replace';

export default function Question() {

	const { question, highlight } = useSelector(state => state.question);

	// Highlights names/titles in question
	const formatQuestion = (q) => {

		// Replaces camel casing to normal spelling
		q = q.replace('allTime', 'all-time');
		for (let el of highlight) {
			q = reactStringReplace(q, el, (match, i) => (
				<span key={match + i} className="highlight">
					{match}
				</span>
			));
		}
		return q;
	};

	return <p className="question">{formatQuestion(question)}</p>;
}