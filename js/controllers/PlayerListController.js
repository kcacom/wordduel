wordDuel.controller("PlayerListController", function($scope, $window, $http, $timeout, gamePlayStorage){
	$scope.playerList = gamePlayStorage.getPlayerList();

	// TODO: change these to settings or something more elegant (this is done in two places: PlayerList and Contacts Controllers).
	gamePlayStorage.initializeMyEmail();
	gamePlayStorage.initializeMyName();
	
	if (!$scope.playerList) {
		gamePlayStorage.setPlayerList([]);
		$scope.playerList = gamePlayStorage.getPlayerList();
	}
	
	$scope.selectPlayer = function(player) {
		$window.location = "gamePlay.html?opponent="+player.email;
	};
	
	$('#playerListBus').bind('playerListUpdated', function(e) {
		$scope.$apply(function() {
			$scope.playerList = gamePlayStorage.getPlayerList();
		});
	});
	$('#newInvite').change(function() {
		$scope.$apply(function() {
			var val = newInviteJqryObj.val();
			var match,
				pl     = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query  = val.substr(val.indexOf("?")+1);
		
			var urlParams = {};
			while (match = search.exec(query))
				urlParams[decode(match[1])] = decode(match[2]);
			var found = false;
			for (var i=0; i<$scope.playerList.length; i++) {
				if ($scope.playerList[i].email == urlParams.inviterEmail) {
					$scope.playerList[i].deviceRegId = urlParams.deviceRegId;
					found = true;
				}
			}
			if (!found)
				$scope.playerList.push({'deviceRegId':urlParams.deviceRegId, 'name':urlParams.inviterName, 'email':urlParams.inviterEmail});
			gamePlayStorage.setPlayerList($scope.playerList);
			sendPushNotification($http, urlParams.deviceRegId, gamePlayStorage.getMyEmail(), null, gamePlayStorage.getDeviceRegId());
		});
	});
});