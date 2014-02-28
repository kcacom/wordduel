'use strict';

wordDuel.controller('GamePlayCtrl', function GamePlayCtrl($scope, gamePlayStorage) {
	var MY_TURN = 'my-turn';
	var THEIR_TURN = 'their-turn';

	$scope.name = gamePlayStorage.getMyName();
	//$scope.game.state = MY_TURN;
});