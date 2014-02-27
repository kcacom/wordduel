var app = {

	showAlert: function (message, title) {
	    if (navigator.notification) {
	        navigator.notification.alert(message, null, title, 'OK');
	    } else {
	        alert(title ? (title + ": " + message) : message);
	    }
	},

	onSuccess: function () {
		showAlert('onSuccess', 'Info');
		for (var i=0; i<contacts.length; i++) {
			$('#contacts').append('<div>' + contacts[i].firstName + ' ' + contacts[i].firstName + '</div><div>' +  contacts[i].email + '</div>');
		}
	},

	onError: function () {
		showAlert('onError', 'Info');
	},

	initialize: function() {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['firstName', 'lastName', 'email'];

        navigator.contacts.find(filter, onSuccess, onError, options);
	}
};

app.initialize();
