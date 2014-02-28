var MY_DEVICE_REG_ID = "myDeviceRegId";

var wordduel = angular.module('wordduel', []);

wordduel.controller("ContactsController", function($scope, $window) {
	$scope.contacts = [];

	$scope.selectContact = function(displayName, givenName, familyName, emailAddress) {
		emailContact(displayName, givenName, familyName, emailAddress);
	};

	function emailContact(displayName, givenName, familyName, emailAddress) {
		var deviceRegId = $window.localStorage.getItem(MY_DEVICE_REG_ID);
		if (!deviceRegId) {
			notify('Unable to send an invitation. Not able to contact Google Cloud Messaging service!', 'Error');
			return;
		}
		var subject = 'Play Word Duel Invitation';
		var body = 'Hello ' + name + ',<br/>';
		body += 'Get the app here: <a href="https://play.google.com/store/apps/details?id=com.mobilewordduel">Word Duel</a><br/>';
		body += 'Then accept the invitation to play: <a href="mobilewordduel://invite/?deviceRegId=' + deviceRegId + '&inviterName=Bob&inviterEmail=kelvcutler@gmail.com">Play!</a>';		
		var recipients = [emailAddress,];
		$window.plugins.emailComposer.showEmailComposerWithCallback(emailContactCallback, subject, body, recipients, null, null, true);
	}
	function emailContactCallback() {
		notify('Player invited!', 'Info');
	}

	$('#contactsBus').bind('successfulContactsCallback', function(e, contacts) {
		$scope.contacts = contacts;
	});
});

function notify(message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
};

var app = {

	initialize: function() {
		var self = this;

		if (navigator.contacts) {
			var fields = ['displayName', 'name', 'emails'];
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;

			self.notify('find', 'info');
			navigator.contacts.find(fields,
				function (contacts) {
					self.notify('success', 'info');
					var normalizedContacts = [];
					for (var i = 0; i < contacts.length; i++) {
						var contact = contacts[i];
						var emailAddress = '';
						for (var ii = 0; contact.emails && ii < contact.emails.length; ii++) {
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
					$('#contactsBus').trigger('successfulContactsCallback', normalizedContacts);
				},
				function (error) {
					self.notify('Unable to show contacts. Error: ' + error, 'Error');
				},
				options);
		} else {
			self.notify('Unable to show contacts. Error: PhoneGap is unable to get the contacts.', 'Error');
		}
		
	}
	
};

function onDeviceReady() {
	app.initialize();
}
document.addEventListener("deviceready", onDeviceReady, false);
