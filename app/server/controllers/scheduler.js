var cron = require('cron');
var Meal = require('../models/meal');
var User = require('../models/user');

var cronJob = cron.CronJob;
var updateMeals = new cronJob('00 14,29,44,59 * * * *', function (req,res) {
    var currentDate = new Date();
    // get all meals
    Meal.find({}, function (err, results) {
        for (var i = 0; i < results.length; i++) {
            if (currentDate >= results[i].time) {
                var people = results[i].people;
                var key = results[i].key;
                Meal.findOneAndRemove({key : results[i].key}, function(err, mealResults) {
                    for (var j = 0; j < people.length; j++) {
                        var query = { 'key' : people[j].key };
                        var update = { mealsAttending: { 'key' : key } };
                        User.findOneAndUpdate(query, { $pull : update }, function(err, userResults) {});
                    }
                });
            }
        }
    });
}, null, true);

var removeMealsForUsers = new cronJob('00 59 23 * * *', function(req,res) {
    User.find({}, function(err, results) {
        for (var i = 0; i < results.length; i++) {
            var query = { 'key' : results[i].key };
            for (var j = 0; j < results[i].mealsAttending.length; j++) {
                var update = { mealsAttending: { 'key' : results[i].mealsAttending[j].key } };
                User.findOneAndUpdate(query, { $pull : update }, function(err, userResults) {});
            }
        }
    });
}, null, true);
