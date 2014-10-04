var express 				= require('express'),
	app						= express(),
	bodyParser 				= require('body-parser'),
	mongoose 				= require('mongoose'),
	mealsController 		= require('./server/controllers/meals-controller');
	userController			= require('./server/controllers/user-controller');

//We have to change this to the actual mongodb db
mongoose.connect('mongodb://mangiamo:MouseDogComputerPhone2014@ds039020.mongolab.com:39020/mangiamoapp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/client/views/index.html');
});

app.get('/map', function(req,res) {
	res.sendFile(__dirname + '/client/views/MainMap.html');
});

//This is a route. Basically, if anything calls for a file that starts with '/js', it looks into the /client/js folder
app.use('/js', express.static(__dirname + '/client/js'));

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