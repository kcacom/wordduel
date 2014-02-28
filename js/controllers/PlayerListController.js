playerList.controller("PlayerListController", ['$scope','$window','$timeout','gamePlayStorage', function($scope, $window, $timeout){
	$scope.playerList = gamePlayStorage.getPlayerList();
	
	if (!$scope.playerList) {
		gamePlayStorage.setPlayerList([{'name':'Kelv Cutler', 'email':'kelvcutler@gmail.com', 'deviceRegId':'0000000'},]);
		$scope.playerList = gamePlayStorage.getPlayerList();
	}
	
	$scope.selectPlayer = function(player) {
		$window.location = "gamePlay.html?opponent="+player.email;
	};
}]);