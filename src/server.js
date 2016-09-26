var path = require('path');
var randomString = require("randomstring");

var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();
var www = __dirname + "/www";

app.use(express.static(www));
app.use(fileUpload());

app.post('/upload/member', function(req, res) {
	if (!req.files) {
		res.send(JSON.stringify({ 
			"file": null,
			"error": null
		}));
		return;
	}
	var file = req.files.file;
	var fileExtension = path.extname(file.name);
	var fileName = randomString.generate({
		length: 32,
		charset: 'alphanumeric'
	}) + fileExtension;
	var filePath = www + "/data/uploads/" + fileName;
	file.mv(filePath, function(err) {
		if (err) {
			res.status(500).send(JSON.stringify({ 
				"file": null,
				"error": err
			}));
		}
		else {
			res.send(JSON.stringify({
				"file": fileName,
				"error": null
			}));
		}
	});
});

app.listen(8888);