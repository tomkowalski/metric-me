var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var api = require('./api.js');
var plotly = require('plotly')('ramimac', 'szqlhrkj2v');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');

app.get('/', function(request, response) {
	//response.send(' <form action="game" method="get"> <input type="text" name="name"/><input type="submit" /></form>');
	 response.render('index');
	//console.log(twitter.getTweets());
  	//twitter.getTweets(response);
  	//response.send('Hello World!')
});
app.get('/query', function (req, res) {
	//console.log(req.query.name);
  //console.log(req);
  //console.log(req.query.twitter);
  api.getData({reddit: req.query.reddit, twitter: req.query.twitter}, function(data) {
    	//console.log(data.personas.key);
    	//console.log(data.personas.values);
       // console.log(data);
          res.render('graphs', {rawData : data}
  		)
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
