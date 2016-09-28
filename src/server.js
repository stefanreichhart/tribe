// // // // // // // // // // // // // // // // // // // // // // // // // // //
// imports
// // // // // // // // // // // // // // // // // // // // // // // // // // //

var path = require('path');
var randomString = require("randomstring");
var log = require('winston');
var express = require('express');
var fileUpload = require('express-fileupload');
var mongodb = require('mongodb');

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// config -> TODO: push to "config.json"
// // // // // // // // // // // // // // // // // // // // // // // // // // //

var app = express();
var www = __dirname + "/www";
var url = 'mongodb://localhost:27017/tribe';

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// statics
// // // // // // // // // // // // // // // // // // // // // // // // // // //

app.use(express.static(www));

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// uploaders
// // // // // // // // // // // // // // // // // // // // // // // // // // //

app.use(fileUpload());

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

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// api
// // // // // // // // // // // // // // // // // // // // // // // // // // //

var router = express.Router();
var mongoClient = mongodb.MongoClient;

app.use('/api', router);

router.get('/members', function(req, res) {
	// TODO: authentication
	mongoClient.connect(url, function(err, db) {
		if (err) {
			res.status(500).json({ results: [], error: err }); 
			db.close();
		} else {
			db.collection('members').find({}).toArray(function(err, docs) { 
				var results = [];
				for (i=0; i<docs.length; i++) {
					var result = docs[i];
					results.push({
						_id: result._id,
						id: result.id,
						poster: result.poster,
						firstname: result.firstname,
						lastname: result.lastname,
						groups: groups
					});
				}
				res.json({ results: results, error: err }); 
				db.close();
			});
		}
	});
});

router.get('/member/:id', function(req, res) {
	// TODO: authentication
	mongoClient.connect(url, function(err, db) {
		if (err) {
			res.status(500).json({ results: null, error: err }); 
			db.close();
		} else {
			db.collection('members').findOne({ _id: req.params.id }, function(err, doc) { 
				res.json({ results: doc, error: err }); 
				db.close();
			});
		}
	});
});

router.get('/members/details', function(req, res) {
	// TODO: authentication
	mongoClient.connect(url, function(err, db) {
		if (err) {
			res.status(500).json({ results: [], error: err }); 
			db.close();
		} else {
			db.collection('members').find({}).toArray(function(err, docs) { 
				res.json({ results: docs, error: err }); 
				db.close();
			});
		}
	});
});

router.get('/groups', function(req, res) {
	// TODO: authentication
	mongoClient.connect(url, function(err, db) {
		if (err) {
			res.json({ results: [], error: err }); 
			db.close();
		} else {
			db.collection('groups').find({}).toArray(function(err, docs) { 
				res.json({ results: docs, error: err }); 
				db.close();
			});
		}
	});
});

router.get('/group/:id', function(req, res) {
	// TODO: authentication
	mongoClient.connect(url, function(err, db) {
		if (err) {
			res.status(500).json({ results: null, error: err }); 
			db.close();
		} else {
			db.collection('groups').findOne({ _id: req.params.id }, function(err, doc) { 
				res.json({ results: doc, error: err }); 
				db.close();
			});
		}
	});
});

// // // // // // // // // // // // // // // // // // // // // // // // // // //
// start
// // // // // // // // // // // // // // // // // // // // // // // // // // //

app.listen(8888);