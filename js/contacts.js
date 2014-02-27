
var MY_DEVICE_REG_ID = "myDeviceRegId";

var app = {

	notify: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	render: function (contacts) {
		var html = '';
		for (var i = 0; i < contacts.length; i++) {
			//html += '<div class="row"><div class="col-md-6 name">' + contacts[i].name.givenName + ' ' + contacts[i].name.familyName + '</div><div class="col-md-6 email">' +  contacts[i].emails[0].value + '</div></div>';
			html += '<div class="row name">' + contacts[i].name.givenName + '</div>';
		}
		$('#contacts').append(html);
	},

	initialize: function() {
		var self = this;

		if (navigator.contacts) {
			var fields = ['name', 'emails'];
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;

			self.notify('find', 'info');
			navigator.contacts.find(fields,
				function (contacts) {
					self.notify('success', 'info');
					self.render(contacts);
				},
				function (error) {
					self.notify(error, 'error');
				},
				options);
		} else {
			var contacts = [
				{"name":{"givenName":"Patrick","familyName":"Morrow"},"emails":[{"type":"home","value":"pat@themorrowgroup.com","pref":true}]},
				{"name":{"givenName":"Teri","familyName":"Morrow"},"emails":[{"type":"home","value":"teri@themorrowgroup.com","pref":true}]},
				{"name":{"givenName":"Joseph","familyName":"Morrow"},"emails":[{"type":"home","value":"joe@themorrowgroup.com","pref":true},{"type":"home","value":"joseph@themorrowgroup.com","pref":false}]}
			];
			self.render(contacts);
		}
		
		if (window.addEventListener) {
			window.addEventListener("storage", self.storageHandler, false);
		} else {
			window.attachEvent("onstorage", self.storageHandler);
		}
	},
	
	storageHandler: function(evt) {
		
		evt = evt || window.event;
		// The event object will contain the following attributes:
		evt.key; // The key of the modified key-value pair.
		evt.oldValue; // Previous value of the pair (null for a new pair).
		evt.newValue; // New value for the pair (null for a deleted pair).
		evt.url; // URL from which the change was made.
		// Note: might be named event.uri instead in old browsers.
		
		if (evt.key == MY_DEVICE_REG_ID) {
			var deviceRegId = window.localStorage.getItem(MY_DEVICE_REG_ID);
			if (deviceRegId) {
				// Update the UI to show that we're able to send our deviceRegId out
			}
		}
	}
};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	app.initialize();
}
