wordDuel.controller("PlayerListController", function($scope, $window, $timeout, gamePlayStorage){
	$scope.playerList = gamePlayStorage.getPlayerList();
	
	if (!$scope.playerList) {
		gamePlayStorage.setPlayerList([{'name':'Kelv Cutler', 'email':'kelvcutler@gmail.com', 'deviceRegId':'0000000'},]);
		$scope.playerList = gamePlayStorage.getPlayerList();
	}
	
	$scope.selectPlayer = function(player) {
		$window.location = "gamePlay.html?opponent="+player.email;
	};
	
	$('#newInvite').change(function() {
		$scope.$apply(function() {
			var match,
				val = $('#inviteBus').val(),
				pl     = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query  = val.substr(val.indexOf("?")+1);
		
			var urlParams = {};
			while (match = search.exec(query))
				urlParams[decode(match[1])] = decode(match[2]);
			$scope.playerList[$scope.playerList.length] = {'deviceRegId':urlParams.deviceRegId, 'name':urlParams.inviterName, 'email':urlParams.inviterEmail};
		});
	});
});