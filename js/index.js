var wordDuel = angular.module('wordDuel', []);

var GCM_SENDER_ID = "244231786937";
var MY_DEVICE_REG_ID = "myDeviceRegId";

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
            	if (e.gameState && e.opponentEmail) {
              		alert('opponent '+e.opponentEmail+' game update: '+e.gameState);
            	} else if (e.opponentEmail && e.deviceRegId) {
              		alert('opponent '+e.opponentEmail+' deviceRegId: '+e.deviceRegId);
            	} else {
            		alert("message: "+JSON.stringify(e));
            	}
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
   },
    initialize: function() {
    	if (window.plugins && window.plugins.pushNotification) {
	    	var pushNotification = window.plugins.pushNotification;
			pushNotification.register(app.successHandler, app.errorHandler,{"senderID":GCM_SENDER_ID,"ecb":"app.onNotificationGCM"});
		}
    },
    errorHandler: function() {
    	// do something
    },
    successHandler: function() {
    	// do something
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

function onDeviceReady() {
	app.initialize();
}
document.addEventListener("deviceready", onDeviceReady, false);

var urlCalled = null;
var newInviteJqryObj = null;


$(document).ready(function() {
	newInviteJqryObj = $('#newInvite');
	if (urlCalled) {
		document.getElementById('newInvite').value = url;
		document.getElementById('newInvite').change();
		urlCalled = null;
	}
});
function handleOpenURL(url) {
	if(newInviteJqryObj) {
		newInviteJqryObj.val(url);
		newInviteJqryObj.change();
	} else {
		urlCalled = url;
	}
};