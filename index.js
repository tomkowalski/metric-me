var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var twitter = require('./twitterAPI.js');
var plotly = require('plotly')('ramimac', 'szqlhrkj2v');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded());

app.get('/', function(request, response) {
	//response.send(' <form action="game" method="get"> <input type="text" name="name"/><input type="submit" /></form>');
	 response.sendfile('index.html');
	//console.log(twitter.getTweets());
  	//twitter.getTweets(response);
  	//response.send('Hello World!')
});
app.get('/game', function (req, res) {
	//console.log(req.query.name);
    twitter.getTweets(req.query.name, function(data) {
    	//console.log(data.personas.key);
    	//console.log(data.personas.values);
    	var chartData = [
	  	{
	    	x: data.personas.key,
	    	y: data.personas.values,
	    	type: "bar"
	  	}
		];
		var graphOptions = {filename: "Persona", fileopt: "overwrite"};
		plotly.plot(chartData, graphOptions, function (err, msg) {
		    res.send('<iframe src=' + msg.url + ".embed "
        + 'height="600" width="100%"'
        + 'scrolling="no" seamless="seamless" frameBorder="0"> </iframe>');

		});	
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
