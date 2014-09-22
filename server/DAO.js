// Here we implement all the CRUD operations for the database
// Along with all our schemas etc. We then export the functionality
// for use in main

var mongoose = require("mongoose");

var schemas = {

};

var models = {

}

// Connect to the database. We could later store these paramaters
// in a config file, but for now we can hardcode them
// Line needs changing for the new database we will connect to.
mongoose.connect("mongodb://seng299projectapp:projectapppassword@ds048537.mongolab.com:48537/seng299");


// Here we put the basic CRUD operations, and any other
// fancy data access functions we want to make available
function create(type, dataObj){
  var data = new models[type](dataObj.data);
  data.save(function(err){
    if(err){
      console.log(JSON.stringify(err));
      completeResponse(dataObj, 500, "text", "");
    }else{
      completeResponse(dataObj, 200, "text", "");
    }
  });
}

function read(type, search, dataObj){
  models[type].find(search, function(err, result){
    if(err){
      console.log(JSON.stringify(err));
      completeResponse(dataObj, 500, "text", "")
    }else{
      completeResponse(dataObj, 200, "json", JSON.stringify(result));
    }
  });
}

function update(type, search, dataObj){
  models[type].update(search, {$set: dataObj.data}, function(err, result){
    if(err){
      console.log(JSON.stringify(err));
      completeResponse(dataObj, 500, "text", "");
    }else{
      completeResponse(dataObj, 200, "text", "");
    }
  });
}

function remove(type, search, dataObj){ // delete is a keyword?
  models[type].find(search).remove(function(err, result){
    if(err){
      console.log(JSON.stringify(err));
      completeResponse(dataObj, 500, "text", "");
    }else{
      completeResponse(dataObj, 200, "text", "");
    }
  });
}
// Export the functions so they are available outside of this module
exports.create = create;
exports.read = read;
exports.update = update;
exports.remove = remove;
