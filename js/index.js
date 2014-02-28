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
                	app.showAlert(""+e.regid, "RegId");
                }
            break;
 
            case 'message':
            	if (e.gameState && e.opponentEmail) {
            		
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

function onDeviceReady() {
	app.initialize();
};
document.addEventListener("deviceready", onDeviceReady, false);


function handleOpenURL(url) {
	setTimeout(function() {
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = url.substr(url.indexOf("?")+1);
	
		var urlParams = {};
		while (match = search.exec(query))
			urlParams[decode(match[1])] = decode(match[2]);
		$('#inviteBus').trigger('newInvite', [urlParams["deviceRegId"], urlParams["inviterName"], urlParams["inviterEmail"]]);
	}, 0);
};