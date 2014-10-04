var express 				= require('express'),
	app						= express(),
	bodyParser 				= require('body-parser'),
	mongoose 				= require('mongoose'),
	config 					= require('./config');
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
	res.sendFile(__dirname + '/client/views/login.html');
});

//This is a route. Basically, if anything calls for a file that starts with '/js', it looks into the /client/js folder
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/img', express.static(__dirname + '/client/img'));

//REST API
//Meals
app.get('/api/meals', mealsController.list);
app.post('/api/meals', mealsController.create);

//Users
app.get('/api/users', userController.list);
app.post('/api/users', userController.create);

app.listen(3000, function() {
	console.log('I\'m listening');
})