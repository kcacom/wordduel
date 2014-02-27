
var MY_DEVICE_REG_ID = "myDeviceRegId";

var wordduel = angular.module('wordduel', []);

wordduel.controller("ContactsController", function($scope, $window, $timeout){
	$scope.contacts = [
				{"name":{"givenName":"Patrick","familyName":"Morrow"},"emails":[{"type":"home","value":"pat@themorrowgroup.com","pref":true}]},
				{"name":{"givenName":"Teri","familyName":"Morrow"},"emails":[{"type":"home","value":"teri@themorrowgroup.com","pref":true}]},
				{"name":{"givenName":"Joseph","familyName":"Morrow"},"emails":[{"type":"home","value":"joe@themorrowgroup.com","pref":true},{"type":"home","value":"joseph@themorrowgroup.com","pref":false}]}
			];
	
	
	$('#contactsBus').bind('successfulContactsCallback', function(e, newContacts) {
		$scope.contacts = newContacts;
	});
	
	$scope.sendEmailTo = function(emailAddress, name) {
		var deviceRegId = $window.localStorage.getItem(MY_DEVICE_REG_ID);
		if (!deviceRegId) {
			self.notify('Unable to send an invitation. Not able to contact Google Cloud Messaging service!', 'Error');
			return;
		}
		var subject = "Play Word Duel Invitation";
		var body = "Hello "+name+",<br/>";
		body += "Get the app here: <a href='https://play.google.com/store/apps/details?id=com.mobilewordduel'>Word Duel</a><br/>";
		body += "Then accept the invitation to play: <a href='mobilewordduel://invite/?deviceRegId="+deviceRegId+"&inviterName=Bob&inviterEmail=kelvcutler@gmail.com'>Play!</a>";		
		var toRecipients = [emailAddress,];
		window.plugins.emailComposer.showEmailComposerWithCallback($scope.emailSentCallback,subject,body,toRecipients,null,null,true);
	};
	$scope.emailSentCallback = function() {
		self.notify('Player invited!', 'Info');
	};
});