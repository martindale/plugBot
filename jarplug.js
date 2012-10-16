// Get twitter status for given account (or for the default one, "PhantomJS")

var page = require('webpage').create()
  , twitterUsername = phantom.args[0]
  , twitterPassword = phantom.args[1]; //< default value

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onLoadFinished = function(status) {
  if ('success' === status) {
  
    page.evaluate(function(){
    
      var url = window.location.href;
      
      if (url === 'http://www.plug.dj/') {
      
        if (0 != $('#twitter').length) {
          console.log("starting twitter oath");
          $('#twitter').click();
        } else {
          console.log('log in successful... going to coding soundtrack!');
          window.location.href = 'http://www.plug.dj/coding-soundtrack/';
        }
        
      } else if (url.substring(0,43) === 'https://api.twitter.com/oauth/authenticate?') {
      
        console.log("submitting twitter oath");
        document.getElementById('username_or_email').value = ''; //TWITTER USERNAME HERE
        document.getElementById('password').value = ''; //TWITTER PASSWORD HERE
        document.getElementById('oauth_form').submit();
        console.log('submitted oath');
        
      } else if (url === 'https://api.twitter.com/oauth/authenticate') {
      
        console.log(document);
      
        var ps = document.getElementsByTagName('p'),
            l = ps.length;
            
        for (var i=0; i<l; i++) {
          if (ps[i].innerHTML.match(/Invalid user name or password/)) {
            throw "invalid username/password for twitter?";
            return;
          }
        }
        
      } else if (url === 'http://www.plug.dj/coding-soundtrack/') {
        console.log("Logged in successfully");
        
        //INITIALIZE HERE, MAKE SURE NOT TO INITIALIZE MULTIPLE TIMES
        if (!window.jarplug) {
          window.jarplug = {};
          API.addEventListener(API.CHAT, function(data) {
          
            switch (data.message) {
              case 'herp':
                API.sendChat('https://gist.github.com/3896543');
              break;
              case '/bitch':
                API.sendChat('Not a lot of things are against the rules, but bitching about the music is. Stop being a bitch.');
              break;
            }
          });
        }
        
      } else {
        console.log("Unknown url: " + url);
      }
    });
  } else {
    console.log("status: " + status);
  }
};

// kick everything off
page.open(encodeURI("http://www.plug.dj"));
