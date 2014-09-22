// This file is the server which handles requests from the client

var http = require("http");
var url = require("url");
var DAO = require("./DAO");
var requestHandlers = require("./requestHandlers.js");

var handle = {};
requestHandlers.setHandle(handle);

var requestID = 1;

function server(request, response){
  try{

    var dataObj = {
      id : new Date().getTime() + requestID,
      request: request,
      response: response,
      data: null,
      identifier: null
    }

    requestID += 1;

    // This covers a weird case where the client is on firefox
    if(request.method == 'OPTIONS'){
      response.writeHead(
        200, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Max-Age": "1000",
          "Access-Control-Allow-Headers": "origin,x-csrftoken,content-type,accept"
        }
      );
      response.end();
      return;
    }

    // Here we route the request to the associated request handler
    var pathname = url.parse(request.url).pathname;
    if(typeof handle[pathname] == 'function'){
      handle[pathname](dataObj);
    }else{
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 not found");
      response.end();
    }

  }catch(err){
    console.log(err);
    response.writeHead(500, {"Content-Type": "text/html"});
    response.write(err);
    response.end();
  }

}

completeResponse = function(dataObj, statusCode, contentType, content){
  var ct = "text/plain";
  if(contentType = "json"){
    ct = "application/json";
  }
  dataObj.response.writeHead(
    statusCode, {
      "Content-Type": ct,
      "Access-Control-Allow-Origin": "*"
    }
  );
  dataObj.response.end(content);
}

var server = http.createServer(server);
server.listen("8888", "127.0.0.1");
