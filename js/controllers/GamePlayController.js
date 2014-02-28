'use strict';

wordDuel.controller('GamePlayCtrl', function GamePlayCtrl($scope, gamePlayStorage) {
	var LETTER_POSSIBLE_STATE = 'p';
	var LETTER_IMPOSSIBLE_STATE = 'i';
	var LETTER_DEFINITE_STATE = 'd';
	var GAME_CHOOSE_WORD_STATE = 'choose-word';
	var GAME_WAITING_STATE = 'waiting';
	var GAME_PLAYING_STATE = 'playing';

	$scope.name = gamePlayStorage.getMyName();
	$scope.opponentName = loadOpponentInfo(urlParams.opponent).name;
	$scope.game = loadGameState(urlParams.opponent);
	$scope.guess = '';

	var state = GAME_CHOOSE_WORD_STATE;
	updateGameState($scope.game);

	// listen for external game state changes
	$('#stateBus').bind('successfulStateCallback', function() {
		$scope.$apply(function () {
			$scope.game = loadGameState($scope.game.opponent);
			updateGameState($scope.game);
		});
	});

	$scope.keyPress = function(key) {
		if (state === GAME_WAITING_STATE || $scope.guess.length >= 4)	return;
		$scope.guess += key;
	};

	$scope.backspace = function () {
		if ($scope.guess.length === 0) return;
		$scope.guess = $scope.guess.slice(0, -1);
	};

	$scope.guessWord = function () {
		if (state === GAME_WAITING_STATE || $scope.guess.length < 4) return;

		if (state === GAME_CHOOSE_WORD_STATE) {
			$scope.game.yourWord = $scope.guess;
		} else if (state === GAME_PLAYING_STATE) {
			if ($scope.game.rounds.length === 0 || $scope.game.rounds[$scope.game.rounds.length - 1].yours.length > 0)
				$scope.game.rounds.push({yours: $scope.guess, theirs: ''});
			else
				$scope.game.rounds[$scope.game.records.length - 1].yours = $scope.guess;
			updateRoundsExtraData($scope.game);
		}
		$scope.guess = '';
		updateGameState($scope.game);
		
		var opponentInfo = loadOpponentInfo(urlParams.opponent);
		sendPushNotification(serializeGame($scope), opponentInfo);
	};

	function loadOpponentInfo(opponent) {
		var players = gamePlayStorage.getPlayerList();
		for (var i=0; i<players.length; i+=1) {
			if (players[i].email === opponent) {
				return players[i];
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
		updateRoundsExtraData(game);
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

	function updateRoundsExtraData(game){
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
		$scope.roundsData = roundsData;
	}

	function getMatches(guess, word) {
		var matches = guess.match(new RegExp('[' + word + ']', 'gi'));
		if (matches === null)
			return 0;
		return matches.length;
	}

	function updateGameState(game) {
		if (game.yourWord === undefined || game.yourWord === '')
			state = GAME_CHOOSE_WORD_STATE;
		else if (game.theirWord === undefined || game.theirWord === '' || (game.rounds.length > 0 && game.rounds[game.rounds.length - 1].theirs.length === 0))
			state = GAME_WAITING_STATE;
		else
			state = GAME_PLAYING_STATE;
		$scope.buttonText = getButtonText(state);
		gamePlayStorage.setGameState(game.opponent, game);
	}

	function getButtonText(state) {
		if (state === GAME_CHOOSE_WORD_STATE)
			return "Choose Secret Word";
		if (state === GAME_WAITING_STATE)
			return "Waiting For Turn...";
		return "Guess";
	}
});