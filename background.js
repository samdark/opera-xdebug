window.addEventListener("load", function() {
	var UIItemProperties = {
		disabled: true,
		title: "Start debug session",
		icon: "xdebug-button.png",
		badge: {
			display: "none", // none
			textContent: "on",
			color: "#fff",
			backgroundColor: "#6f6"
		},
		onclick: function(){
			// Send a message to the currently-selected tab.
			var tab = opera.extension.tabs.getFocused();
			if(tab){ // Null if the focused tab is not accessible by this extension
				tab.postMessage({
					idekey: window.widget.preferences['idekey']
				});
				//xDebugButton.icon = xDebugButtonProperties.iconEnabled;
			}
		}
	};

	// Next, we create the button and apply the above properties.
	var button = opera.contexts.toolbar.createItem(UIItemProperties);
	// Finally, we add the button to the toolbar.
	opera.contexts.toolbar.addItem(button);

	function enableButton() {
		var tab = opera.extension.tabs.getFocused();
		if(tab){
			button.disabled = false;
		} else{
			button.disabled = true;
		}
	}

	// Enable the button when a tab is ready.
	opera.extension.onconnect = enableButton;
	opera.extension.tabs.onfocus = enableButton;
	opera.extension.tabs.onblur = enableButton;

	opera.extension.onmessage = function(event){
		switch(event.data){
			case 'xdebug.enabled':
				button.title = "Stop Xdebug session";
				button.badge.display = "block";
			break;
			case 'xdebug.disabled':
				button.title = "Start Xdebug session";
				button.badge.display = "none";
			break;
		}
  	}
}, false);