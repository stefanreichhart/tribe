// require
var path = require('path');
var randomString = require("randomstring");
var log = require('winston');
var express = require('express');
var fileUpload = require('express-fileupload');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var app = express();
var www = __dirname + "/www"; // only serve files from this directory !
var url = 'mongodb://localhost:27017/tribe';
var router = express.Router();

// linking
app.use(express.static(www));
app.use(fileUpload());
app.use('/api', router);


// image uploader for member poster
app.post('/upload/member', function(req, res) {
	if (!req.files) {
		log.warn("Invalid request - No files");
		res.status(400).send(JSON.stringify({ 
			"file": null,
			"error": null
		}));
		return;
	}
	var file = req.files.file;
	var form = req.body;
	/*
		TODO this request MUST contain some additional authentication information
		auth = {
			app: ID,
			session: ID,
			request: ID,
			member: ID,
			path: URL 
		}
	*/
	if (!file || !form || form.member == undefined || form.member == null || !form.path || form.path.indexOf("/edit/member/") != 0 ) {
		log.warn("Invalid request - No extras", { body: form });
		res.status(403).send(JSON.stringify({ 
			"file": null,
			"error": null
		}));
		return;
	}
	var fileExtension = path.extname(file.name);
	var fileName = randomString.generate({
		length: 32,
		charset: 'alphanumeric'
	}) + fileExtension;
	var filePath = www + "/data/uploads/" + fileName;
	file.mv(filePath, function(err) {
		if (err) {
			log.error("Moving file", { from: file.path, to: filePath }, err);
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

var connect = function(fnSuccess, fnError) {
	mongoClient.connect(url, function(err, db) {
		if (!err) {
			fnSuccess(db);
		} else {
			console.log(err);
			log.error("DB Error", { connection: err });
			fnError(err, db);
		}		
	});
};

router.get('/members', function(req, res) {
	connect(
		function(db) {
			db.collection('members').find({}).toArray(function(err, docs) { 
				res.json({ results: docs, error: err }); 
				db.close();
			});
			
		},
		function(err, db) { 
			res.json({ results: [], error: err }); 
			db.close();
		}
	);
});

router.get('/groups', function(req, res) {
	connect(
		function(db) {
			db.collection('groups').find({}).toArray(function(err, docs) { 
				res.json({ results: docs, error: err }); 
				db.close();
			});
		},
		function(err, db) { 
			res.json({ results: [], error: err }); 
			db.close();
		}
	);
});


app.listen(8888);