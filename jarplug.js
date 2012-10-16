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
              case '/awesome':
                $('#button-vote-positive').click();
                API.sendChat('smiff, upvote.');
              break;
              case '/bitch':
                API.sendChat('Not a lot of things are against the rules, but bitching about the music is. Stop being a bitch.');
              break;
              case '/music':
                // TODO: implement times of day, a la @chrisinajar
                API.sendChat('Evening! Most people are out of work so things are a lot more fluid and much less harsh. Seats are easy to get, spin a few if you want but don\'t hog the decks!');
              break;
              case '/rules':
                API.sendChat('No song limits, no queues, no auto-dj. Pure FFA. DJ\'s over 10 minutes idle (measured by chat) face the [boot]. See /music for music suggestions, though there are no defined or enforced rules on music. More: http://goo.gl/b7UGO');
              break;
              case '/afk':
                API.sendChat('If you\'re afk at the end of your song for longer than 30 minutes you get warning 1. One minute later you get warning 2, another minute last warning, 30 seconds [boot].');
              break;
              case '/afpdj':
              case '/aftt':
                API.sendChat('-AFTT- AFPDJ is just as bad as AFK. DJ\'s must pay attention to chat, if you cannot do that then don\'t DJ during prime time. The purpose of these rules is so that active users who can pay attention to chat at their employer\'s expense can sit up on the decks.');
              break;
              case '/count':
                API.sendChat('There are ' + API.getUsers().length + ' users.');
              break;
              case '/djs':
                var DJs = API.getDJs();
                API.sendChat(DJs.map(function(dj) {
                  return dj.username;
                }).join(', '));
              break;
              case 'mj':
                API.sendChat('As usual, everything is Mad Joker\'s fault.');
              break;
              /* case '/aww':
              
              break;
              case '/dummy':
                API.sendChat('');
              break; */
              
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
