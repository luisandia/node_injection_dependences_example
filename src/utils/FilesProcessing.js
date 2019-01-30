const multiparty = require('multiparty');
const fs = require('fs');
var form = new multiparty.Form();
const util = require('util');


function FilesProcessing(req, res, next) {

   let dataObject = {};

   form.parse(req, function(err, fields, files) {
   	//console.log(req);
   	console.log(util.inspect({fields: fields, files: files}));
   	Object.keys(fields).forEach(function(name) {
   		dataObject[`${name}`] = fields[name][0];
   	});

   	Object.keys(files).forEach(function(name) {
   		dataObject[`${name}`] = files[name][0];
   	});

   	req.newObject = dataObject;
   	 // console.log('Upload completed!');
  //res.setHeader('text/html');
  //res.end('Received ' + files.length + ' files');
   });
   next();
}

module.exports = FilesProcessing;