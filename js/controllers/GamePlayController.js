'use strict';

wordDuel.controller('GamePlayCtrl', function GamePlayCtrl($scope, gamePlayStorage) {
	var LETTER_POSSIBLE_STATE = 'p';
	var LETTER_IMPOSSIBLE_STATE = 'i';
	var LETTER_DEFINITE_STATE = 'd';
	var GAME_CHOOSE_WORD_STATE = 'choose-word';
	var GAME_PLAYING_STATE = 'playing';

	$scope.name = gamePlayStorage.getMyName();
	$scope.opponentName = loadOpponentInfo(urlParams.opponent);
	$scope.game = loadGameState(urlParams.opponent);

	var state = getGameState($scope.game);
	$scope.buttonText = getButtonText(state);

	// listen for external game state changes
	$('#gamePlayBus').bind('successfulStateCallback', function() {
		$scope.$apply(function() {
			$scope.game = loadGameState($scope.game.opponent);
		});
	});

	function loadOpponentInfo(opponent) {
		var players = gamePlayStorage.getPlayerList();
		for (var i=0; i<players.length; i+=1) {
			if (players[i].email === opponent) {
				return players[i].name;
			}
		}
		return 'Unknown';
	}

	function loadGameState(opponent) {
		var current = $scope.game;
		var game = gamePlayStorage.getGameState(opponent);

		if (game.opponent === undefined) return createNewGame(opponent);

		if (current !== undefined) {
			game.letterStates = current.letterStates;
		} else if (game.letterStates === undefined) {
			game.letterStates = createLetterStates();
		}
		game.roundsData = getRoundsExtraData(game);
		return game;
	}

	function createNewGame(opponent) {
		return {
			opponent: opponent,
			yourWord: '',
			theirWord: '',
			rounds: [],
			letterStates: createLetterStates()
		}
	}

	function createLetterStates() {
		return {
			a: LETTER_POSSIBLE_STATE,
			b: LETTER_POSSIBLE_STATE,
			c: LETTER_POSSIBLE_STATE,
			d: LETTER_POSSIBLE_STATE,
			e: LETTER_POSSIBLE_STATE,
			f: LETTER_POSSIBLE_STATE,
			g: LETTER_POSSIBLE_STATE,
			h: LETTER_POSSIBLE_STATE,
			i: LETTER_POSSIBLE_STATE,
			j: LETTER_POSSIBLE_STATE,
			k: LETTER_POSSIBLE_STATE,
			l: LETTER_POSSIBLE_STATE,
			m: LETTER_POSSIBLE_STATE,
			n: LETTER_POSSIBLE_STATE,
			o: LETTER_POSSIBLE_STATE,
			p: LETTER_POSSIBLE_STATE,
			q: LETTER_POSSIBLE_STATE,
			r: LETTER_POSSIBLE_STATE,
			s: LETTER_POSSIBLE_STATE,
			t: LETTER_POSSIBLE_STATE,
			u: LETTER_POSSIBLE_STATE,
			v: LETTER_POSSIBLE_STATE,
			w: LETTER_POSSIBLE_STATE,
			x: LETTER_POSSIBLE_STATE,
			y: LETTER_POSSIBLE_STATE,
			z: LETTER_POSSIBLE_STATE
		};
	}

	function getRoundsExtraData(game){
		var roundsData = [];
		for (var i=0; i<game.rounds.length; i+=1) {
			roundsData[i] = {
				yours: {
					parts: game.rounds[i].yours.split(''),
					matches: getMatches(game.rounds[i].yours, game.theirWord)
				},
				theirs: {
					parts: game.rounds[i].theirs.split(''),
					matches: getMatches(game.rounds[i].theirs, game.yourWord)
				}
			}
		}
		return roundsData;
	}

	function getMatches(guess, word) {
		var matches = guess.match(new RegExp('[' + word + ']', 'gi'));
		if (matches === null)
			return 0;
		return matches.length;
	}

	function getGameState(game) {
		if (game.yourWord === undefined || game.yourWord === '' || game.theirWord === undefined || game.theirWord === '')
			return GAME_CHOOSE_WORD_STATE;
		return GAME_PLAYING_STATE;
	}

	function getButtonText(state) {
		if (state === GAME_CHOOSE_WORD_STATE)
			return "Choose Secret Word";
		return "Guess";
	}
});