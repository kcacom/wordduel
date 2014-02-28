/*!
 * node-gcm
 * Copyright(c) 2013 Marcus Farkas <toothlessgear@finitebox.com>
 * MIT Licensed
 */

// CONSTANTS

var Constants = {
    'GCM_SEND_ENDPOINT' : 'android.googleapis.com',
    'GCM_SEND_ENDPATH' : '/gcm/send',
    'GCM_SEND_URI' : 'https://android.googleapis.com:443/gcm/send',
    'PARAM_REGISTRATION_ID' : 'registration_id',
    'PARAM_COLLAPSE_KEY' : 'collapse_key',
    'PARAM_DELAY_WHILE_IDLE' : 'delay_while_idle',
    'PARAM_PAYLOAD_KEY' : 'data',
    'PARAM_TIME_TO_LIVE' : 'time_to_live',
    'ERROR_QUOTA_EXCEEDED' : 'QuotaExceeded',
    'ERROR_DEVICE_QUOTA_EXCEEDED' : 'DeviceQuotaExceeded',
    'ERROR_MISSING_REGISTRATION' : 'MissingRegistration',
    'ERROR_INVALID_REGISTRATION' : 'InvalidRegistration',
    'ERROR_MISMATCH_SENDER_ID' : 'MismatchSenderId',
    'ERROR_NOT_REGISTERED' : 'NotRegistered',
    'ERROR_MESSAGE_TOO_BIG' : 'MessageTooBig',
    'ERROR_MISSING_COLLAPSE_KEY' : 'MissingCollapseKey',
    'ERROR_UNAVAILABLE' : 'Unavailable',
    'TOKEN_MESSAGE_ID' : 'id',
    'TOKEN_CANONICAL_REG_ID' : 'registration_id',
    'TOKEN_ERROR' : 'Error',
    'JSON_REGISTRATION_IDS' : 'registration_ids',
    'JSON_PAYLOAD' : 'data',
    'JSON_SUCCESS' : 'success',
    'JSON_FAILURE' : 'failure',
    'JSON_CANONICAL_IDS' : 'canonical_ids',
    'JSON_MULTICAST_ID' : 'multicast_id',
    'JSON_RESULTS' : 'results',
    'JSON_ERROR' : 'error',
    'JSON_MESSAGE_ID' : 'message_id',
    'UTF8' : 'UTF-8',
    'BACKOFF_INITIAL_DELAY' : 1000,
    'MAX_BACKOFF_DELAY' : 1024000  ,
    'SOCKET_TIMEOUT' : 180000 //three minutes
};


// MULTICAST RESULT

function MulitcastResult() {
    this.success = undefined;
    this.failure = undefined;
    this.canonicalIds = undefined;
    this.multicastId = undefined;
    this.results = [];
    this.retryMulticastIds = [];
}

MulitcastResult.prototype.addResult = function (result) {
    this.results.push(result);
};

MulitcastResult.prototype.getTotal = function () {
    return this.success + this.failure;
};



// RESULT

function Result() {
    this.messageId = undefined;
    this.canonicalRegistrationId = undefined;
    this.errorCode = undefined;
}



// MESSAGE

function Message(obj) {
    if (obj) {
        this.collapseKey = obj.collapseKey || undefined;
        this.delayWhileIdle = obj.delayWhileIdle || undefined;
        this.timeToLive = obj.timeToLive || undefined;
        this.data = obj.data || {};
    } else {
        this.collapseKey = undefined;
        this.delayWhileIdle = undefined;
        this.timeToLive = undefined;
        this.data = {};
    }
    if (Object.keys(this.data).length > 0) {
        this.hasData = true;
    } else {
        this.hasData = false;
    }
}

Message.prototype.addData = Message.prototype.addDataWithKeyValue = function (key, value) {
    this.hasData = true;
    this.data[key] = value.toString();
};

Message.prototype.addDataWithObject = function (obj) {
    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        this.data = obj;
        this.hasData = true;
    }
};




// SENDER


function Sender(key , options, requestMaker) {
    this.key = key;
    this.options = options;
	this.requestMaker = requestMaker;
}

var sendNoRetryMethod = Sender.prototype.sendNoRetry = function (message, registrationIds, callback) {
    var body = {},
        result = new Result(),
        requestBody,
        post_options,
        post_req,
        timeout;

    body[Constants.JSON_REGISTRATION_IDS] = registrationIds;

    if (message.delayWhileIdle !== undefined) {
        body[Constants.PARAM_DELAY_WHILE_IDLE] = message.delayWhileIdle;
    }
    if (message.collapseKey !== undefined) {
        body[Constants.PARAM_COLLAPSE_KEY] = message.collapseKey;
    }
    if (message.timeToLive !== undefined) {
        body[Constants.PARAM_TIME_TO_LIVE] = message.timeToLive;
    }
    if (message.hasData) {
        body[Constants.PARAM_PAYLOAD_KEY] = message.data;
    }

    requestBody = JSON.stringify(body);

    post_options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-length': Buffer.byteLength(requestBody, 'utf8'),
            'Authorization': 'key=' + this.key
        },
        uri: Constants.GCM_SEND_URI,
        body: requestBody
    };

    if(this.options && this.options.proxy){
        post_options.proxy = this.options.proxy;
    }

    timeout = Constants.SOCKET_TIMEOUT;

    if(this.options && this.options.timeout){
        timeout =  this.options.timeout;
    }

    post_options.timeout = timeout;

	alert('Request to make: '+JSON.stringify(post_options));
	this.requestMaker.post(post_options).success(function(data, status, headers, config) {
		alert('Success: '+data);
		if (!data)
			return callback('response is null', null);

		try {
			var dataObj = JSON.parse(data);
		} catch (e) {
			return callback("json error", null);
		}
		callback(null, dataObj);
	}).error(function(data, status, headers, config) {
		alert('Error: '+status+'; data: '+data);
		return callback(status, null);
	});
};

Sender.prototype.send = function (message, registrationId, retries, callback) {

    var attempt = 1,
        backoff = Constants.BACKOFF_INITIAL_DELAY;

    if (registrationId.length === 1) {

    	this.sendNoRetry(message, registrationId, function lambda(err, result) {

            if (result === undefined) {
                if (attempt < retries) {
                    var sleepTime = backoff * 2 * attempt;
                    if (sleepTime > Constants.MAX_BACKOFF_DELAY) {
                        sleepTime = Constants.MAX_BACKOFF_DELAY;
                    }
                    timer.setTimeout(function () {
                    	sendNoRetryMethod(message, registrationId, lambda);
                    }, sleepTime);
                } else {
                    console.log('Could not send message after ' + retries + ' attempts');
                    callback(null, result);
                }
                attempt += 1;
            } else callback(null, result);
        });
    } else if (registrationId.length > 1) {
    	this.sendNoRetry(message, registrationId, function lambda(err, result) {

            if (attempt < retries) {
                var sleepTime = backoff * 2 * attempt,
                    unsentRegIds = [],
                    i;
                if (sleepTime > Constants.MAX_BACKOFF_DELAY) {
                    sleepTime = Constants.MAX_BACKOFF_DELAY;
                }

                if (result) {
                    for (i = 0; i < registrationId.length; i += 1) {
                        if (result.results[i].error === 'Unavailable') {
                            unsentRegIds.push(registrationId[i]);
                        }
                    }
                }

                registrationId = unsentRegIds;
                if (registrationId.length !== 0) {
                    timer.setTimeout(function () {
                    	sendNoRetryMethod(message, registrationId, lambda);
                    }, sleepTime);
                    attempt += 1;
                } else callback(null, result);

            } else {
                console.log('Could not send message to all devices after ' + retries + ' attempts');
                callback(null, result);
            }
        });
    } else {
        console.log('No RegistrationIds given!');
        callback('No RegistrationIds given!', null);
    }
};

function serializeGame(game) {
	var myHalf = "";
	var theirHalf = "";
	for (var i=0; i<game.rounds.length; i++) {
		myHalf += game.rounds[i].yours;
		theirHalf += game.rounds[i].theirs;
	}
	return game.yourWord + myHalf + "|" + game.theirWord + theirHalf;
}

function sendPushNotification(requestMaker, sendToDeviceRegId, myEmail, gameState, myDeviceRegId) {
	if (!opponentInfo.deviceRegId)
		return false;
	var message = new Message({
	    collapseKey: 'com.mobilewordduel',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        'gameState': gameState,
	        'deviceRegId': myDeviceRegId,
	        'opponentEmail': myEmail,
	        'title': "Game update received",
	        'message': "Tap to see game"
	    }
	});
	
	var sender = new Sender('AIzaSyApAdaVOhDgJn9_gkhm_TSptw0TM0FgaSA', null, requestMaker);
	var registrationIds = [];
	
	registrationIds.push(sendToDeviceRegId); 
	
	/**
	 * Params: message-literal, registrationIds-array, No. of retries, callback-function
	 **/
	alert("about to call send on sender!");
	sender.send(message, registrationIds, 4, function (err, result) {
	    alert("err: "+err+"; result: "+result);
	});
	return true;
}
