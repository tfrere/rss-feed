const bodyParser = require('body-parser');
const cors = require('cors');
const jsonfile = require('jsonfile');
const moment = require("moment");
const sentencer = require("sentencer");
const generateName = require('node-random-name');

const tools = require('./helpers/tools.js');

const configFile = "./data/config.json";
let config = jsonfile.readFileSync(configFile);
const articleCountLimit = 10;

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.set('origins', '*:*');
app.use(bodyParser.json());
app.set('port', 5001);
app.use(cors());


const generateBoard = function() {
  return config[tools.randomIntFromInterval(0, config.length - 1)].title;
}

const generateFeedName = function(boardName) {
  for(var i = 0; i < config.length; i++) {
    if (config[i].title == boardName) {
      return config[i].feeds[tools.randomIntFromInterval(0, config[i].feeds.length - 1)].title;
    }
  }
}

const generateTitle = function() {
  const titles = [
    sentencer.make("This title has {{ a_noun }} and {{ an_adjective }} {{ noun }} in it."),
    sentencer.make("Drunk, this guy has {{ a_noun }} with {{ an_adjective }} {{ noun }}."),
    sentencer.make("Someone who's got {{ a_noun }} with a {{ an_adjective }} {{ noun }}."),
    sentencer.make("Another one, he's {{ an_adjective }}."),
    sentencer.make("A guy, he's {{ an_adjective }}."),
    sentencer.make("I'm out of {{ an_adjective }} {{ noun }}, please help me."),
    sentencer.make("These {{ noun }}s are the {{ an_adjective }} {{ noun }}.")
  ];
  return titles[tools.randomIntFromInterval(0,titles.length - 1)];
}

const generateItem = function(publishDate) {
  const board = generateBoard();
  return {
    title: generateTitle(),
    title: generateTitle(),
    content: generateTitle(),
    image: null,
    date: moment(publishDate).fromNow(),
    isFreshContent: tools.isFreshContent(publishDate),
    link: "#",
    creator: generateName(),
    board: board,
    feedName: generateFeedName(board),
    status: "success"
  };
}

const generateFeed = function() {
  let feed = [];
  const numberOfItems = tools.randomIntFromInterval(5, 15);

  for(var i = 0; i <= numberOfItems; i++) {
    const newDate = new Date();
    const publishDate = moment(newDate).add(-i * 2, 'day');
    feed.push(generateItem(publishDate));
  }

  return feed;
}

const generateFeeds = function(numberOfFeeds) {
  let feeds = [];

  for(var i = 0; i <= numberOfFeeds; i++)
    feeds.push(generateFeed());

  return feeds;
}

const randomFeeds = generateFeeds(20);

// ===================
// FEED SOCKET
// ===================

io.on('connection', function(socket) {

  console.log("socket connected");

  config.map(function(board) {
    board.feeds.map(function(feed) {
      setInterval(function () {

        const newDate = new Date();
        const publishDate = moment(newDate).add(-50, 'second');
        const item = generateItem(publishDate);
        socket.emit('listIsUpdated', item);

      }, feed.refreshRate * 100);
    });
  });

  // socket.on('update', function(msg){
  //   console.log('feed: ' + msg);
  // });

  socket.on('disconnect', function(){
    console.log('socket disconnected');
  });

});


// ===================
// FEED ROUTE
// ===================

app.get('/feed', function(req,res) {
  const index = tools.hashFromString(req.param("url"));
  res.status(200).send(randomFeeds[index % 2]);
});

// ===================
// CONFIG ROUTE
// ===================

app.get('/config', function(req,res) {
    if(config)
      return res.status(200).send(config);
    else
      console.log("No config file.");
});

app.post('/config', function(req,res) {
    console.log(req.body);
    if(req.body) {
      config = req.body;
      jsonfile.writeFileSync(configFile, req.body);
      return res.status(200).send("The config has been updated correctly !");
    }
    else
      console.log("The config file is not correct.");
});

// ===================
// LAUNCH SERVER
// ===================

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
