var express = require('express');
var app = express();
var path = __dirname + "/www";

app.use(express.static(path));
app.listen(8888);