var express=require('express');
var fs = require('fs');
var app=express();
app.set('view engine','jade');
app.get('/', function(req, res)
{
//res.send('<h1>Server is working fine</h1>');
fs.readFile('views/index.html', function(err, data){
res.send(data.toString());
});	
});

app.get('/test-page', function(req,res)
{
	res.render('this is the test successful page');
});

var server=app.listen(3000,function()
{
});

