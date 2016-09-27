var fs = require("fs");
var path = require("path");
var randomString = require("randomstring");
var log = require('winston')
var mongodb = require('mongodb');
var objectId = mongodb.ObjectID;
var mongoClient = mongodb.MongoClient;

var dataPath = path.dirname(__dirname) + "/data";
var jsonFile = "demo.json";
var jsonPath = dataPath + "/" + jsonFile;
var dotJsonPath = dataPath + "/." + jsonFile;
var url = 'mongodb://localhost:27017/tribe';

log.info("Importing Demo database", { path: dataPath, file: jsonFile }); 

fs.readdir(dataPath, function(err, files) {
	if (err) {
		log.error("Reading directory", { path: dataPath }); 
	} else {
		var imported = files.filter(function(file) {
			return file.indexOf(dotJsonPath) > 0;
		});
		if (imported.length > 0) {
			log.info("Demo database already imported", { path: dataPath, file: jsonPath, dotFile: dotJsonPath });
		} else {
			fs.readFile(jsonPath, "utf8", function(err, bytes) {
				if (err) {
					log.error("Reading file", { file: jsonPath });
				} else {
					var json = JSON.parse(bytes);
					mongoClient.connect(url, function(err, db) {
						if (err) {
							log.error("Connecting to Mongo-DB", { url: url, error: err });
						} else {
							var groups = db.collection('groups');
							var groupMapping = {};
							groups.insertMany(json.groups, function(err, result) {
								if (err) { 
									log.error("Adding groups", { groups: json.groups, error: err });
								} else {
									log.info("Adding groups successful");
									for (var g=0; g<result.ops.length; g++) {
										var group = result.ops[g];
										groupMapping[group.id] = group._id;
									}
									var members = db.collection('members');
									members.insertMany(json.members, function(err, result) {
										if (err) {
											log.error("Adding members", { members: json.members, error: err });
										} else {
											log.info("Adding members successful");
											for (var i=0; i<result.ops.length; i++) {
												var member = result.ops[i];
												var newgroups = [];
												for (var g=0; g<member.groups.length; g++) {
													var groupId = member.groups[g];
													newgroups.push(groupMapping[groupId]);
												}
												members.update({ "_id": objectId(member._id) }, { "$set": { "groups": newgroups }}, function(err, r) {
													if (err) {
														log.error("Updating member", { member: member, groups: newgroups, error: err });
													} else {
														if (i >= result.ops.length - 1) {
															fs.writeFile(dotJsonPath, "", function(err) {
																if(err) {
																	log.error("Importing demo database", { file: dotJsonPath, error: err });
																} else {
																	log.info("Importing Demo database successful", { path: dataPath, file: jsonPath, dotFile: dotJsonPath }); 
																}
															});
															db.close();
														}
													}
												});
											}
										} 
									});
								}
							});
						} 
					});
				} 
			});
		}
	}
});