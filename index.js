var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var twitter = require('./twitterAPI.js');
var plotly = require('plotly')('ramimac', 'szqlhrkj2v');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded());
app.set('view engine', 'jade');

app.get('/', function(request, response) {
	//response.send(' <form action="game" method="get"> <input type="text" name="name"/><input type="submit" /></form>');
	 response.render('index');
	//console.log(twitter.getTweets());
  	//twitter.getTweets(response);
  	//response.send('Hello World!')
});
app.get('/game', function (req, res) {
	//console.log(req.query.name);
    twitter.getTweets(req.query.name, function(data) {
    	//console.log(data.personas.key);
    	//console.log(data.personas.values);
          res.render('graphs',
  			{ baseData : data }
  		)
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
