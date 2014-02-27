var app = {

	notify: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	render: function (contacts) {
		var $contacts = $('#contacts');
		for (var i = 0; i < contacts.length; i++) {
			$contacts.append('<div class="row"><div class="col-md-6 name">' + contacts[i].name.givenName + ' ' + contacts[i].name.familyName + '</div><div class="col-md-6 email">' +  contacts[i].emails[0].value + '</div></div>');
		}
	},

	initialize: function() {
		var self = this;

		if (navigator.contacts) {
			var fields = ['name', 'emails'];
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;

			navigator.contacts.find(fields,
				function (contacts) {
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
	}
};

app.initialize();
