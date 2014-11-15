var cron = require('cron');
var Meal = require('../models/meal');
var User = require('../models/user');

var cronJob = cron.CronJob;
var updateMeals = new cronJob('00 14,29,44,59 * * * *', function () {
    var currentDate = new Date();
    // get all meals
    Meal.find({}, function (err, results) {
        for (var i = 0; i < results.length; i++) {
            if (currentDate >= results[i].time) {
                var people = results[i].people;
                var key = results[i].key;
                Meal.findOneAndRemove({key : results[i].key}, function(err, results) {
                    for (var j = 0; j < people.length; j++) {
                        var query = { 'key' : people[j].key };
                        var update = { mealsAttending: { 'key' : key } };
                        User.findOneAndUpdate(query, { $pull : update }, function(err, results) {});
                    }
                });
            }
        }
    });
}, null, true);
