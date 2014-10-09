(function() {
	var po = document.createElement('script');
	po.type = 'text/javascript'; 
	po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();

/* Executed when the APIs finish loading */
function render() {
	// Additional params
	var additionalParams = {
		'theme' : 'dark'
	};
	gapi.signin.render('googleLogin', additionalParams);
}

function getUserInfo() {
	// Step 4: Load the Google+ API
	gapi.client.load('plus', 'v1').then(function() {
		// Step 5: Assemble the API request
		var request = gapi.client.plus.people.get({
			'userId': 'me'
		});
		// Step 6: Execute the API request
		request.then(function(resp) {
			console.log(resp.result.id);
			console.log(resp.result.displayName);
		}, 
		function(reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	});
}


function signinCallback(authResult) {
	if (authResult['status']['signed_in']) {
		// Update the app to reflect a signed in user
		getUserInfo();

    } 
    else {
    	// Update the app to reflect a signed out user
    	// Possible error values:
    	//   "user_signed_out" - User is signed-out
    	//   "access_denied" - User denied access to your app
    	//   "immediate_failed" - Could not automatically log in the user
    	// console.log('Sign-in state: ' + authResult['error']);
    }
}