var express 				= require('express'),
	app						= express(),
	bodyParser 				= require('body-parser'),
	mongoose 				= require('mongoose'),
	config 					= require('./config'),
	mealsController 		= require('./server/controllers/meals-controller');
	userController			= require('./server/controllers/user-controller');
	options 				= { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 10000 } },
                				replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 10000 } } };

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

//This is a route. Basically, if anything calls for a file that starts with '/js', it looks into the /client/js folder
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/img', express.static(__dirname + '/client/img'));
app.use('/views', express.static(__dirname + '/client/views'));
app.use('/json', express.static(__dirname + '/client/json'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

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
