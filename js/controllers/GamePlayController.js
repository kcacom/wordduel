'use strict';

wordDuel.controller('GamePlayCtrl', function GamePlayCtrl($scope, $http, gamePlayStorage) {
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
			$scope.game = loadGameState(urlParams.opponent);
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

	$scope.toggleLetterState = function(letter) {
		var letterState = $scope.game.letterStates[letter];
		if (letterState === LETTER_POSSIBLE_STATE)
			$scope.game.letterStates[letter] = LETTER_IMPOSSIBLE_STATE;
		else if (letterState === LETTER_IMPOSSIBLE_STATE)
			$scope.game.letterStates[letter] = LETTER_DEFINITE_STATE;
		else
			$scope.game.letterStates[letter] = LETTER_POSSIBLE_STATE;
		updateGameState($scope.game);
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
		sendPushNotification($http, opponentInfo.deviceRegId, gamePlayStorage.getMyEmail(), serializeGame($scope.game), null);
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

		if (game.opponent === undefined) return createNewGame();

		if (current !== undefined) {
			game.letterStates = current.letterStates;
		} else if (game.letterStates === undefined) {
			game.letterStates = createLetterStates();
		}
		updateRoundsExtraData(game);
		return game;
	}

	function createNewGame() {
		return {
			yourWord: '',
			theirWord: '',
			rounds: [],
			letterStates: createLetterStates()
		}
	}

	function createLetterStates() {
		return {
			A: LETTER_POSSIBLE_STATE,
			B: LETTER_POSSIBLE_STATE,
			C: LETTER_POSSIBLE_STATE,
			D: LETTER_POSSIBLE_STATE,
			E: LETTER_POSSIBLE_STATE,
			F: LETTER_POSSIBLE_STATE,
			G: LETTER_POSSIBLE_STATE,
			H: LETTER_POSSIBLE_STATE,
			I: LETTER_POSSIBLE_STATE,
			J: LETTER_POSSIBLE_STATE,
			K: LETTER_POSSIBLE_STATE,
			L: LETTER_POSSIBLE_STATE,
			M: LETTER_POSSIBLE_STATE,
			N: LETTER_POSSIBLE_STATE,
			O: LETTER_POSSIBLE_STATE,
			P: LETTER_POSSIBLE_STATE,
			Q: LETTER_POSSIBLE_STATE,
			R: LETTER_POSSIBLE_STATE,
			S: LETTER_POSSIBLE_STATE,
			T: LETTER_POSSIBLE_STATE,
			U: LETTER_POSSIBLE_STATE,
			V: LETTER_POSSIBLE_STATE,
			W: LETTER_POSSIBLE_STATE,
			X: LETTER_POSSIBLE_STATE,
			Y: LETTER_POSSIBLE_STATE,
			Z: LETTER_POSSIBLE_STATE
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
		var matches = 0;

		for (var i=0; i<word.length; i+=1) {
			if (guess.indexOf(word[i]) >= 0)
				matches += 1;
		}

		return matches;
	}

	function updateGameState(game) {
		if (game.yourWord === undefined || game.yourWord === '')
			state = GAME_CHOOSE_WORD_STATE;
		else if (game.theirWord === undefined || game.theirWord === '' || (game.rounds.length > 0 && game.rounds[game.rounds.length - 1].theirs.length === 0))
			state = GAME_WAITING_STATE;
		else
			state = GAME_PLAYING_STATE;
		$scope.buttonText = getButtonText(state);
		gamePlayStorage.setGameState(urlParams.opponent, game);
	}

	function getButtonText(state) {
		if (state === GAME_CHOOSE_WORD_STATE)
			return "Choose Secret Word";
		if (state === GAME_WAITING_STATE)
			return "Waiting For Turn...";
		return "Guess";
	}
});