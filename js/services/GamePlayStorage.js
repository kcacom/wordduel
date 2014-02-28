'use strict';

gamePlay.factory('gamePlayStorage', function () {
	var MY_EMAIL = 'my-email';
	var MY_NAME = 'my-name';
	var DEVICE_REG_ID = 'deviceRegId';
	var PLAYER_LIST = 'player-list';

	function getValue(key, defaultValue) {
		return JSON.parse(localStorage.getItem(key)) || defaultValue;
	}

	function setValue(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	return {
		getMyEmail: function () {
			return getValue(MY_EMAIL, '');
		},
		setMyEmail: function (email) {
			setValue(MY_EMAIL, email);
		},
		getMyName: function () {
			return getValue(MY_NAME, 'You');
		},
		setMyName: function (name) {
			setValue(MY_NAME, name);
		},
		getDeviceRegId: function () {
			return getValue(DEVICE_REG_ID, '');
		},
		setDeviceRegId: function (id) {
			setValue(DEVICE_REG_ID, id);
		},
		getPlayerList: function () {
			return getValue(PLAYER_LIST, []);
		},
		setPlayerList: function (list) {
			setValue(PLAYER_LIST, list);
		},
		getGameState: function (playerEmail) {
			return getValue(playerEmail, {});
		},
		setGameState: function (playerEmail, state) {
			setValue(playerEmail, state);
		}
	}
});