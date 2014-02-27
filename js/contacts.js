var app = {

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	initialize: function() {
		var self = this;

		var options = new ContactFindOptions();
		options.filter = '';
		options.multiple = true;
		var filter = ['firstName', 'lastName', 'email'];

		navigator.contacts.find(filter,
			function (contacts) {
				showAlert('success', 'info');
				for (var i=0; i<contacts.length; i++) {
					$('#contacts').append('<div>' + contacts[i].firstName + ' ' + contacts[i].firstName + '</div><div>' +  contacts[i].email + '</div>');
				}
			},
			function (error) {
				self.showAlert(error, 'error');
			},
			options);
	}
};

app.initialize();
