wordDuel.controller("PlayerListController", function($scope, $window, $timeout, gamePlayStorage){
	$scope.playerList = gamePlayStorage.getPlayerList();
	
	if (!$scope.playerList) {
		gamePlayStorage.setPlayerList([{'name':'Kelv Cutler', 'email':'kelvcutler@gmail.com', 'deviceRegId':'0000000'},]);
		$scope.playerList = gamePlayStorage.getPlayerList();
	}
	
	$scope.selectPlayer = function(player) {
		$window.location = "gamePlay.html?opponent="+player.email;
	};
	
	$('#inviteBus').bind('newInvite', function(e, deviceRegId, inviterName, inviterEmail) {
		$scope.playerList[$scope.playerList.length] = {'deviceRegId':deviceRegId, 'name':inviterName, 'email':inviterEmail};
	});
});