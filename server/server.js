'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var awsBucket = "servify-test"

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.get("/", function(req, res){
    var file_path = path.normalize(__dirname + "/../client/index.html");
    res.sendFile(file_path);
});

// Used Strongloop's REST API for uploading file. However the same could have been achieved using this API
/*app.post("/files", function(req, res){
    var fileContainerModel = app.models.fileContainer
    var options = {
        container: awsBucket
    };
    // Handling for file upload. Multiple file upload supported.
    fileContainerModel.upload(req, res, options, function(err, obj){
        if(err) {
            res.send({"success" : false, "errorStr" : "Error Reading file"});
            return;
        }
        res.send({"success" : true, "errorStr" : "Error Reading file"});
    });
});

// Added express routes for file listing and downloading. 
app.get("/files", function(req, res){
    var fileContainerModel = app.models.fileContainer
    var file_name = req.query.name;
    // Handling for downloading a file in get request has name field.
    if (file_name != undefined && file_name != "") {
        fileContainerModel.download(awsBucket, file_name, req, res, function(err){
            if (err) res.send("Error in downloading file.");
        });
        return;
    }
    // Else just fetch the list of files
    fileContainerModel.getFiles(awsBucket, function(err, result){
        var file_path = path.normalize(__dirname + "/../client/file_list.html");
        if (err) {
            res.render(file_path, {"file_list" :[], "error":"Error in fetching files from server."})
            return;
        }
        res.render(file_path, {"file_list" : result, "error" : ""});
    });
});*/

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
