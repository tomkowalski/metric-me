module.exports = {
	getData : function(usernames, callback) {
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
		var data = {
			twitter: {disp: false},
			reddit: {disp: false}
		}
		var promArr = [];
		if(usernames.twitter != "" || usernames.twitter != null) {
			promArr.push(new Promise( function(resolveTwit, rejectTwit) {
				client.get('statuses/user_timeline', {screen_name: usernames.twitter, count:1000, trim_user:true}, function(error, tweets, response){
		  			if(error) {
		  				rejectTwit(); 
		  			}
		  			var strOut = "";
					for(var i = 0; i < tweets.length; i++) {
						strOut = strOut + tweets[i].text;
					}
					indicoHelp(data.twitter, strOut, function(error) {
						if(error){
							rejectTwit();
						}
						else {
							data.twitter.disp = true;
							resolveTwit();
						}
					});
		  		});
			}));
		}
		if(usernames.reddit != "" || usernames.reddit != null) {
			promArr.push(new Promise( function(resolveRed, rejectRed) {
				var rawjs = require('raw.js');
				var reddit = new rawjs("Metric.me Personality");
				reddit.userComments({user: usernames.reddit, limit: 100}, function(err, response) {
					if(err != null) {
						rejectRed();
					}
					var strOut = "";
					var arr = response.children;
					for (var i = 0; i < arr.length; i ++) {
						strOut += arr[i].data.body;
					}
					indicoHelp(data.reddit, strOut, function(error) {
						if(error){
							rejectRed();
						}
						else {
							data.reddit.disp = true;
							resolveRed();
						}
					});
				});
			}));
		}
		Promise.all(promArr).then(
  			function() {
  				callback(data);
  			},
  			function() {
  				console.log("error!");
  		});		
	}
};


function indicoHelp(data, strOut, callback) {
	var indProm = [];
	data.personas = {
		key: [],
		values: []
	};	
	data.political = {
		key: [],
		values: []
	};
	data.sentiment ={
			values: []
	};
	var indico = require('indico.io');
	indico.apiKey = process.env.INDICO_KEY;
	indProm.push(
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
	indProm.push(
		indico.sentiment(strOut)
		.then(function(res) {
			return new Promise( function(resolve, reject) {
				data.sentiment.values.push(res);
				resolve();
			});
		}).catch(function(err) {
			return new Promise( function(resolve, reject) {
				reject();
			});
		}));
	indProm.push(
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
	Promise.all(indProm).then(
  		function() {
  			callback(false);
  		},
  		function() {
  			callback(true);				
  		});	
}