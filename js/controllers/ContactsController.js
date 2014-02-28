var MY_DEVICE_REG_ID = "myDeviceRegId";

var wordDuel = angular.module('wordDuel', []);

wordDuel.controller("ContactsController", function ContactsController($scope, $window, gamePlayStorage) {
	$scope.contacts = [];

	$scope.selectContact = function(displayName, givenName, familyName, emailAddress) {
		emailContact(displayName, givenName, familyName, emailAddress);
	};

	function emailContact(contact) {
		var deviceRegId = $window.localStorage.getItem(MY_DEVICE_REG_ID);
		if (!deviceRegId) {
			notify('Unable to send an invitation. Not able to contact Google Cloud Messaging service!', 'Error');
			return;
		}

		// TODO: change these to settings
		var myname = gamePlayStorage.getMyName() || '';
		while (myname == null || myname.length == 0) {
			myname = prompt('Enter your name?');
		}
		gamePlayStorage.setMyName(myname);
		var myemail = gamePlayStorage.getMyEmail() || '';
		while (myemail == null || myemail.length == 0) {
			myemail = prompt('Enter your email?');
		}
		gamePlayStorage.setMyEmail(myemail);

		var subject = 'Play Word Duel Invitation';
		var body = 'Hello ' + contact.displayName + ',<br/>';
		body += 'Get the app here: <a href="https://play.google.com/store/apps/details?id=com.playwordduel">Word Duel</a><br/>';
		body += 'Then accept the invitation to play: <a href="https://googledrive.com/host/0B42c8HW7dKbZYUZlZFJaZVU5RlU/transfer.html?deviceRegId=' + deviceRegId + '&inviterName=' + myname + '&inviterEmail=' + myemail +'">Play!</a>';		
		var torecipients = [contact.emailAddress];
		$window.plugins.emailComposer.showEmailComposerWithCallback(null, subject, body, torecipients, null, null, true, null, null);

		// TODO: should use the callback, but the callback isn't being called

		var players = gamePlayStorage.getPlayerList();
		players.push({"email":contact.emailAddress,"name":contact.displayName,"deviceRegId":null});
		gamePlayStorage.setPlayerList(players)

		notify('Player invited!', 'Info');

		$window.location.href = 'index.html';
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
		var displayName = contact.displayName || '';
		var givenName = contact.name.givenName || '';
		var familyName = contact.name.familyName || '';
		if (displayName.length == 0) {
			displayName = givenName + (familyName.length > 0 ? ' ' + familyName : '');
		}
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
		if (displayName.length > 0 && emailAddress.length > 0) {
			normalizedContacts.push({
				"displayName": displayName,
				"givenName": givenName,
				"familyName": familyName,
				"emailAddress": emailAddress
			});
		}
	}
	$('#contactsBus').trigger('successfulContactsCallback', [normalizedContacts]);
	spinnerplugin.hide();
}

var app = {

	initialize: function() {
		if (navigator.contacts) {
			spinnerplugin.show();

			var fields = ['displayName', 'name', 'emails'];
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;

			navigator.contacts.find(fields,
				function (contacts) {
					processContacts(contacts);
				},
				function (error) {
					spinnerplugin.hide();
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
