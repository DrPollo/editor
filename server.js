/**
 * Created by drpollo on 06/04/2017.
 */
var express = require('express');
var app = express();
var path    = require("path");

// app.use(express.static('src'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/libs', express.static(__dirname + '/libs'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/src/index.html');
})

app.get('/test',function(req,res){
    res.sendFile(__dirname+'/index.html');
})


app.listen(8080);

console.log("InputMap running at Port 8080");