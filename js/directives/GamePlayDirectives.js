app.directive('iLetter', function() {
	return {
		scope: {
			letter: '=letter',
			state: '=state'
		},
		templateUrl: "i-letter.html"
	};
});
