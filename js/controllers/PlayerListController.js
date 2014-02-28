wordDuel.controller("PlayerListController", function($scope, $window, $timeout, gamePlayStorage){
	$scope.playerList = gamePlayStorage.getPlayerList();
	$scope.inviteReceived = false;
	
	if (!$scope.playerList) {
		gamePlayStorage.setPlayerList([]);
		$scope.playerList = gamePlayStorage.getPlayerList();
	}
	
	$scope.selectPlayer = function(player) {
		$window.location = "gamePlay.html?opponent="+player.email;
	};
	
	$('#newInvite').change(function() {
		$scope.$apply(function() {
			var match,
				val = newInviteJqryObj.val(),
				pl     = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query  = val.substr(val.indexOf("?")+1);
		
			var urlParams = {};
			while (match = search.exec(query))
				urlParams[decode(match[1])] = decode(match[2]);
			$scope.playerList.push({'deviceRegId':urlParams.deviceRegId, 'name':urlParams.inviterName, 'email':urlParams.inviterEmail});
			gamePlayStorage.setPlayerList($scope.playerList);
			$scope.inviteReceived = true;
		});
	});
});