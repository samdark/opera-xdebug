window.addEventListener('load', function(event) {
	var cookie = {
		get: function(name) {
			if(!document.cookie || !document.cookie.length)
				return null;

			var start = document.cookie.indexOf(name+"=");
			if(start == -1)
				return null;

			start = start+name.length+1;
			var end = document.cookie.indexOf(";", start);
			if(end == -1)
				end = document.cookie.length;

			return decodeURIComponent(document.cookie.substring(start, end));
		},
		set: function(name, value, expireDays, path) {
			var expireDate=new Date();
			expireDate.setDate(expireDate.getDate()+expireDays);

            var pExpires = expireDays ? ';expires='+expireDate.toUTCString() : '';
			var pPath = path ? ';path='+(path) : '';

			document.cookie = [name, '=', encodeURIComponent(value), pExpires, pPath].join('');
		},
		remove: function(name, path) {
			this.set(name, '', -30, path);
		}
	};

	function isDebugEnabled(){
		return cookie.get('XDEBUG_SESSION');
	}

	function sendBackDebugState(isEnabled){
		opera.extension.postMessage('xdebug.'+(isEnabled ? 'enabled' : 'disabled'));
	}

	opera.extension.onmessage = function(event){
		var idekey = event.data.idekey;

		var debugEnabled = isDebugEnabled();
		sendBackDebugState(debugEnabled);

		if(!debugEnabled)
			cookie.set('XDEBUG_SESSION', idekey, 30, '/');
		else
			cookie.remove('XDEBUG_SESSION', '/');

		document.location.reload();
	};

	// update debug state on extension start
	sendBackDebugState(isDebugEnabled());
}, false);