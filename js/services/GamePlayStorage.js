'use strict';

wordDuel.factory('gamePlayStorage', function () {
	var MY_EMAIL = 'my-email';
	var MY_NAME = 'my-name';
	var DEVICE_REG_ID = 'deviceRegId';
	var PLAYER_LIST = 'player-list';

	function getJson(key, defaultValue) {
		return JSON.parse(localStorage.getItem(key) || defaultValue);
	}

	function setJson(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	function getString(key, defaultValue) {
		return localStorage.getItem(key) || defaultValue;
	}

	function setString(key, value) {
		localStorage.setItem(key, value);
	}

	return {
		getMyEmail: function () {
			return getString(MY_EMAIL, '');
		},
		setMyEmail: function (email) {
			setString(MY_EMAIL, email);
		},
		getMyName: function () {
			return getString(MY_NAME, '');
		},
		setMyName: function (name) {
			setString(MY_NAME, name);
		},
		getDeviceRegId: function () {
			return getString(DEVICE_REG_ID, '');
		},
		setDeviceRegId: function (id) {
			setString(DEVICE_REG_ID, id);
		},
		getPlayerList: function () {
			return getJson(PLAYER_LIST, '[]');
		},
		setPlayerList: function (list) {
			setJson(PLAYER_LIST, list);
		},
		getGameState: function (playerEmail) {
			return getJson(playerEmail, '{}');
		},
		setGameState: function (playerEmail, state) {
			setJson(playerEmail, state);
		}
	}
});