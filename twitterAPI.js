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
			for(var i = 0; i < tweets.length; i++) {
				strOut = strOut + tweets[i].text;
			}
			var indico = require('indico.io');
			indico.apiKey = process.env.INDICO_KEY;
			var data = {
				personas: {
					key: [],
					values: []
				},
				political: {
					key: [],
					values: []
				}
			};
			var promArr = [];
			promArr.push(
				indico.personas(strOut)
  				.then(function(res) {
  					return new Promise( function(resolve, reject) {
  						for (var key in res) {
  							if (res.hasOwnProperty(key)) {
    							data.personas.key.push(key);
  								data.personas.values.push(res[key]);
  							}
						}
						resolve();
					});
    			}).catch(function(err) {
    				return new Promise( function(resolve, reject) {
           				reject();
         			});
  				}));
  			promArr.push(
  				indico.political(strOut)
  				.then(function(res) {
  					return new Promise( function(resolve, reject) {
  						for (var key in res) {
  							if (res.hasOwnProperty(key)) {
    							data.political.key.push(key);
  								data.political.values.push(res[key]);
  							}
						}
						resolve();
					});		
  				}).catch(function(err) {
    				return new Promise( function(resolve, reject) {
           				reject();
         			});
  			}));
  			Promise.all(promArr).then(
  				function() {
  					callback(data);
  				},
  				function() {
  					console.log("error");
  			});
		});
		
	}
};
function getTweetsText(data, callback) {
	
	callback.send(arr);
}