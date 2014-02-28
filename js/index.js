app.successHandler = function() {
	
};
app.errorHandler = function() {
	
};
app.initialize = function() {
	if (window.plugins && window.plugins.pushNotification) {
    	var pushNotification = window.plugins.pushNotification;
		pushNotification.register(app.successHandler, app.errorHandler,{"senderID":GCM_SENDER_ID,"ecb":"app.onNotificationGCM"});
	}
};

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