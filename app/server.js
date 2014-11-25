var express 				= require('express'),
	app						= express(),
	cron		 			= require('cron'),
	server					= require('http').createServer(app),
	io						= require('socket.io'),
	bodyParser 				= require('body-parser'),
	mongoose 				= require('mongoose'),
	config 					= require('./config'),
	mealsController 		= require('./server/controllers/meals-controller');
	userController			= require('./server/controllers/user-controller');
	contactController		= require('./server/controllers/contact-controller');
	scheduler				= require('./server/controllers/scheduler.js');
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

//REST API
//Meals
app.put('/api/meals/delete', mealsController.deleteMeal);
app.put('/api/meals/update', mealsController.update);
app.post('/api/meals/get', mealsController.get);
app.post('/api/meals/people', mealsController.getPeople);
app.put('/api/meals/people', mealsController.deletePeople);
app.post('/api/meals/create', mealsController.create);

//Users
app.post('/api/users/get', userController.list);
app.post('/api/users/create', userController.create);
app.put('/api/users', userController.update);
app.post('/api/users/buddies', userController.getMealBuddies);
app.post('/api/users/facebook', userController.findByFacebook);
app.put('/api/users/meals', userController.addMealToUser);
app.put('/api/users/deleteMeals', userController.deleteMealFromUser);

//Meal buddies stuff
app.put('/api/users/buddies/request', userController.requestBuddy);
app.put('/api/users/buddies/confirm', userController.confirmBuddy);
app.put('/api/users/buddies/suggest', userController.suggestBuddy);
app.put('/api/users/buddies/suggest/stop', userController.stopSuggesting);
app.put('/api/users/buddies/remove', userController.removeBuddy);
app.put('/api/users/buddies/ignore', userController.ignoreBuddy);

//Contact form
app.post('/contact', contactController.sendEmail);

// app.listen(3000, function() {
server.listen(3000, function() {
	console.log('I\'m listening');
})

io = io.listen(server);

io.sockets.on('connection', function(socket) {
	socket.on('databaseChange', function(data) {
		io.sockets.emit('dataChanged', data);
	});
});
