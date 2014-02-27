var app = {

	onSuccess: function (){
		alert('onSuccess');
	}

	onError: function (){
		alert('onError');
	}

	initialize: function() {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var filter = ['firstName', 'email'];

        navigator.contacts.find(filter, onSuccess, onError, options);
	}
};

app.initialize();
