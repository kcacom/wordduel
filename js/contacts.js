var app = {

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	displayContacts: function (contacts) {
		for (var i = 0; i < contacts.length; i++) {
			$('#contacts').append('<div>' + contacts[i].firstName + ' ' + contacts[i].lastName + '</div><div style="margin-bottom: 10px;">' +  contacts[i].email + '</div>');
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
					self.showAlert('success', 'info');
					self.displayContacts(contacts);
				},
				function (error) {
					self.showAlert(error, 'error');
				},
				options);
		} else {
			var contacts = [
				{'firstName':'f1','lastName':'l1','email':'e1'},
				{'firstName':'f2','lastName':'l2','email':'e2'},
				{'firstName':'f3','lastName':'l3','email':'e3'}
			];
			self.showAlert('success', 'info');
			self.displayContacts(contacts);
		}
	}
};

app.initialize();
