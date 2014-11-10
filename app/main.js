var express 				= require('express'),
	passport 				= require('passport'), 
	FacebookStrategy 		= require('passport-facebook').Strategy,
	app						= express(),
	bodyParser 				= require('body-parser'),
	util 					= require('util'),
	cookieparser 			= require("cookieparser"),
	mongoose 				= require('mongoose'),
	config 					= require('./config'),
	User 					= require('./server/models/user');
	mealsController 		= require('./server/controllers/meals-controller');
	userController			= require('./server/controllers/user-controller');
	options 				= { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 10000 } }, 
                				replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 10000 } } };

// Needs to be at the top!
// This is a route. Basically, if anything calls for a file that starts with '/js', it looks into the /client/js folder
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/img', express.static(__dirname + '/client/img'));
app.use('/views', express.static(__dirname + '/client/views'));
app.use('/json', express.static(__dirname + '/client/json'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// set the 'dbUrl' to the mongodb url that corresponds to the environment we are in
app.set('dbUrl', config.db['development']);
// connect mongoose to the mongo dbUrl
mongoose.connect(app.get('dbUrl'), options);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

//Facebook authentication
passport.use(new FacebookStrategy({
	clientID: 283325225209622,
    clientSecret: "c0f7916fc9cba7495409679025aba041",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function (accessToken, refreshToken, profile, done) {
	console.log("Success");
	User.find({
		facebookID : profile.id
	}, function (err, user) {
		if(err) { // Error
			return done(err);
		}
		if(user.length == 0) { // Then this is a new user
			console.log("New User");
		}
		else { // Then the user was found in the DB and is an existing user
			console.log(user);
			return done(err, user);
		}
	});
}
));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', function (req, res, next) {
	passport.authenticate('facebook', function (err, user, info) {
		// This is the default destination upon successful login.
    	var succesUrl = '/#/main';
    	var failureUrl = '/#/login';

    	// Add logic to redirect

    	return res.redirect(successUrl);

	})(req, res, next);
});

//REST API
//Meals
app.put('/api/meals', mealsController.update);
app.get('/api/meals', mealsController.list);
app.get('/api/meals/people', mealsController.getPeople);
app.post('/api/meals', mealsController.create);

//Users
app.get('/api/users', userController.list);
app.post('/api/users', userController.create);
app.put('/api/users', userController.update);
app.get('/api/users/buddies', userController.getMealBuddies);
app.get('/api/users/facebook', userController.findByFacebook);
app.get('/api/users/google', userController.findByGoogle);
app.put('/api/users/meals', userController.addMealToUser);

//Meal buddies stuff
app.put('/api/users/buddies/request', userController.requestBuddy);
app.put('/api/users/buddies/confirm', userController.confirmBuddy);
app.put('/api/users/buddies/suggest', userController.suggestBuddy);
app.put('/api/users/buddies/suggest/stop', userController.stopSuggesting);
app.put('/api/users/buddies/remove', userController.removeBuddy);
app.put('/api/users/buddies/ignore', userController.ignoreBuddy);


app.listen(3000, function() {
	console.log('I\'m listening');
})