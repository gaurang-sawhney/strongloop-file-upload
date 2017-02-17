'use strict';
var path = require('path');

module.exports = function(Filecontainer) {
    Filecontainer.getFileList = function(container, req, res, callback) {
        var fileContainerModel = Filecontainer.app.models.fileContainer
        fileContainerModel.getFiles(container, function(err, result){
            var file_path = path.normalize(__dirname + "/../../client/file_list.html");
            if (err) {
                res.render(file_path, {"file_list" :[], "message":"Error in fetching files from server."})
                return;
            }
            var message = "";
            if (result.length == 0) {
                message = "No files found."
            } 
            res.render(file_path, {"file_list" : result, "message" : message});
        });
    }

    Filecontainer.remoteMethod (
        'getFileList',
        {
          http: {path: '/:container/getFileList', verb: 'get'},
          accepts: [{arg: 'container', type: 'string'},
                    {arg: 'req', type: 'object', 'http': {source: 'req'}},
                    {arg: 'res', type: 'object', 'http': {source: 'res'}}]
        }
    );
};
