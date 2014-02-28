'use strict';

var wordDuel = angular.module('wordDuel', []);

var urlParams;
(window.onpopstate = function () {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
})();


var GCM_SENDER_ID = "244231786937";
var MY_DEVICE_REG_ID = "deviceRegId";

var app = {

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                	window.localStorage.setItem(MY_DEVICE_REG_ID, e.regid);
                }
            break;
 
            case 'message':
            	if (e.payload) {
	            	try {
		            	if (e.payload.gameState && e.payload.opponentEmail) {
		              		deserializeAndStoreGameState(e.payload.opponentEmail, e.payload.gameState);
		              		if (stateBusJqryObj) {
		              			stateBusJqryObj.trigger('successfulStateCallback', []);
		              		}
		            	} else if (e.payload.opponentEmail && e.payload.deviceRegId) {
		            		updatePlayerList(e.payload.opponentEmail, e.payload.deviceRegId);
		              		if (playerListBusJqryObj) {
		              			playerListBusJqryObj.trigger('playerListUpdated', []);
		              		}
		            	}
		            } catch(ex) {
		            	alert(ex);
		            }
	            }
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
   }
    
};

function deserializeAndStoreGameState(opponentEmail, gameState) {
	var split = gameState.split('|');
	var game = {
		yourWord: getSecretWord(split[1]),
		theirWord: getSecretWord(split[0]),
		rounds: getRounds(split[1], split[0])
	};

	function getSecretWord(segment) {
		return segment.length > 3 ? segment.slice(0, 4) : '';
	}

	function getRounds(yours, theirs) {
		var rounds = [];
		yours = yours.slice(4);
		theirs = theirs.slice(4);
		while (yours.length > 0 || theirs.length > 0) {
			rounds.push({yours: yours.slice(0, 4), theirs: theirs.slice(0, 4)})
			yours = yours.slice(4);
			theirs = theirs.slice(4);
		}
	}

	window.localStorage.setItem(opponentEmail, JSON.stringify(game));
}

function updatePlayerList(opponentEmail, deviceRegId) {
	var playerList = localStorage["player-list"];
	var players;
	if (playerList)
		players = JSON.parse(playerList);
	else
		players = [];
	var found = false;
	for (var i=0; i<players.length; i+=1) {
		if (players[i].email === opponentEmail) {
			players[i].deviceRegId = deviceRegId;
			found = true;
		}
	}
	if (!found) {
		players.push({'name':'Unknown','email':opponentEmail,'deviceRegId':deviceRegId});
	}
	localStorage["player-list"] = JSON.stringify(players);
}


var playerListBusJqryObj = null;
var stateBusJqryObj = null;


$(document).ready(function() {
	if ($('#playerListBus').length)
		playerListBusJqryObj = $('#playerListBus');
	if ($('#stateBus').length)
		stateBusJqryObj = $('#stateBus');
});
