var MY_DEVICE_REG_ID = "myDeviceRegId";

var wordDuel = angular.module('wordDuel', []);

wordDuel.controller("ContactsController", function ContactsController($scope, $window, $location, gamePlayStorage) {
	$scope.contacts = [];

	$scope.selectContact = function(displayName, givenName, familyName, emailAddress) {
		emailContact(displayName, givenName, familyName, emailAddress);
	};

	function emailContact(displayName, givenName, familyName, emailAddress) {
		var deviceRegId = 0;
		/*
		var deviceRegId = $window.localStorage.getItem(MY_DEVICE_REG_ID);
		if (!deviceRegId) {
			notify('Unable to send an invitation. Not able to contact Google Cloud Messaging service!', 'Error');
			return;
		}
		*/
		var subject = 'Play Word Duel Invitation';
		var body = 'Hello ' + name + ',<br/>';
		body += 'Get the app here: <a href="https://play.google.com/store/apps/details?id=com.mobilewordduel">Word Duel</a><br/>';
		body += 'Then accept the invitation to play: <a href="mobilewordduel://invite/?deviceRegId=' + deviceRegId + '&inviterName=Bob&inviterEmail=kelvcutler@gmail.com">Play!</a>';		
		var recipients = [emailAddress,];
		$window.plugins.emailComposer.showEmailComposerWithCallback(function() {
			emailContactCallback(displayName, givenName, familyName, emailAddress, deviceRegId);
		}, subject, body, recipients, null, null, true);
	}
	function emailContactCallback(displayName, givenName, familyName, emailAddress, deviceRegId) {
		notify('Player invited!', 'Info');

		var players = gamePlayStorage.getPlayerList();
		players.push({"email":emailAddress,"name":displayName,"deviceRegId":deviceRegId});
		notify(JSON.stringify(players));
		//gamePlayStorage.setPlayerList(players)

		$location = "index.html";
	}

	$('#contactsBus').bind('successfulContactsCallback', function(e, contacts) {
		$scope.$apply(function() {
			$scope.contacts = contacts;
		});
	});
});

function notify(message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
};

function processContacts(contacts) {
	var normalizedContacts = [];
	for (var i = 0; i < contacts.length; i++) {
		var contact = contacts[i];
		var emailAddress = '';
		for (var ii = 0; contact.emails && ii < contact.emails.length; ii++) {
			if (ii == 0) {
				emailAddress = contact.emails[ii].value || '';
			}
			if (contact.emails[ii].pref) {
				emailAddress = contact.emails[ii].value || '';
				break;
			}
		};
		normalizedContacts.push({
			"displayName": contact.displayName || '',
			"givenName": contact.name.givenName || '',
			"familyName": contact.name.familyName || '',
			"emailAddress": emailAddress
		});
	}
	$('#contactsBus').trigger('successfulContactsCallback', [normalizedContacts]);
}

var app = {

	initialize: function() {
		if (navigator.contacts) {
			var fields = ['displayName', 'name', 'emails'];
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;

			navigator.contacts.find(fields,
				function (contacts) {
					processContacts(contacts);
				},
				function (error) {
					notify('Unable to show contacts. Error: ' + error, 'Error');
				},
				options);
		} else {
			notify('Unable to show contacts. Error: PhoneGap is unable to get the contacts.', 'Error');
		}
		
	}
	
};

function onDeviceReady() {
	app.initialize();
}
document.addEventListener("deviceready", onDeviceReady, false);
