module.exports = {
	getTweets : function(name, callback) {
		var Twitter = require('twitter');
 		var env = require('node-env-file');
 		if(process.env.NODE_ENV != "Production") {
 			env('.env');
 		}
		var client = new Twitter({
  			consumer_key: process.env.TWITTER_CONSUMER_KEY,
		    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		});
		client.get('statuses/user_timeline', {screen_name: name, count:3000, trim_user:true}, function(error, tweets, response){
  			if(error) throw error;
  			var strOut = "";
			
			//var data = JSON.parse(tweets);
			//console.log(data);
			for(var i = 0; i < tweets.length; i++) {
				strOut = strOut + tweets[i].text;
			}
			var indico = require('indico.io');
			indico.apiKey = process.env.INDICO_KEY;
			indico.personas(strOut)
  			.then(function(res) {
    			callback.send(res);
  			}).catch(function(err) {
    			console.warn(err);
  			});
  			indico.political(strOut)
  			.then(function(res) {
  				callback.send(res);
  			}).catch(function(err) {
  				console.warn(err);
  			});
		});
	}
};
function getTweetsText(data, callback) {
	
	callback.send(arr);
}