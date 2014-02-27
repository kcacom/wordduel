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
			//$contacts.append('<div class="name">' + contacts[i].firstName + ' ' + contacts[i].lastName + '</div><div class="email">' +  contacts[i].email + '</div>');
			$contacts.append('d');
		}
	},

	initialize: function() {
		var self = this;

		if (navigator.contacts) {
			var options = new ContactFindOptions();
			options.filter = '';
			options.multiple = true;
			var filter = ['firstName', 'lastName', 'email'];

			navigator.contacts.find(filter,
				function (contacts) {
					self.render(contacts);
				},
				function (error) {
					self.notify(error, 'error');
				},
				options);
		} else {
			var contacts = [
				{'firstName':'f1','lastName':'l1','email':'e1'},
				{'firstName':'f2','lastName':'l2','email':'e2'},
				{'firstName':'f3','lastName':'l3','email':'e3'}
			];
			self.render(contacts);
		}
	}
};

app.initialize();
