const bodyParser = require('body-parser');
const cors = require('cors');
const jsonfile = require('jsonfile');
const moment = require("moment");
const fetch = require("node-fetch");

const tools = require('./helpers/tools.js');
const devTools = require('./helpers/dev-tools.js');

const configFile = "./data/config.json";
const boardsFile = "./data/boards.json";
let config = jsonfile.readFileSync(configFile);
let boards = jsonfile.readFileSync(boardsFile);

const articleCountLimit = 10;

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.set('origins', '*:*');
app.use(bodyParser.json());
app.set('port', 5001);
app.use(cors());

const randomFeeds = devTools.generateFeeds(boards, 20);

// ===================
// FEED SOCKET
// ===================

io.on('connection', function(socket) {

  console.log("socket connected");

  boards.map(function(board) {
    board.feeds.map(function(feed) {
      setInterval(function () {

        const newDate = new Date();
        const publishDate = moment(newDate).add(-50, 'second');
        const item = devTools.generateItem(boards, publishDate);
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
//
// app.get('/feed', function(req,res) {
// 
//   const feedUrl = req.param("url");
//   const domain = "https://query.yahooapis.com/v1/public/yql?format=json&q=";
//   const request = 'SELECT * FROM feednormalizer WHERE output="rss_2.0" AND url ="' + feedUrl + '"';
//   const url = domain + encodeURIComponent(request);
//
//   fetch(url)
//   .then(response => response.json())
//   .then(data => {
//
//     console.log("=========");
//     console.log("ROUTE : /feed");
//     console.log("URL : " + feedUrl);
//
//     let feed = [];
//     // if YQL is up
//     if (data.query && data.query.results) {
//       // if YQL is responding correcly
//       if (data.query.results.rss && data.query.results.rss.channel) {
//
//         const articles = data.query.results.rss.channel.item;
//         feed.status = "success";
//         console.log(articles);
//         articles.map(function(article, i) {
//           if (i <= articleCountLimit) {
//             // console.log(1);
//             feed.push({
//               title: article.title,
//               content: tools.sanitizeContent(article.description),
//               image: tools.getFirstImageUrl(article.description),
//               date: moment(article.date).fromNow(),
//               isFreshContent: tools.isFreshContent(article.date),
//               link: article.link,
//               creator: article.creator,
//               status: article.status
//             });
//           }
//           if (articles.length == i) {
//             return feed;
//           }
//         });
//
//         console.log("RESPONSE : 200\n=========\n");
//       }
//       else {
//         feed.status = "error";
//         console.log("RESPONSE : 500 - YQL doesn't suppor this feed\n=========\n");
//       }
//     }
//     else {
//       feed.status = "error";
//       console.log("RESPONSE : 500 - YQL doesn't suppor this feed\n=========\n");
//     }
//     return feed;
//   })
//   .then(feed => {
//     console.log(feed);
//     if (feed.status == "success")
//       res.status(200).send(feed);
//     else
//       res.status(500).send("YQL doesn't suppor this feed");
//   })
//   .catch(error => {
//     console.log("Timeout ou fetch error");
//     //console.log(error);
//   });
// });

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
    if(req.body) {
      config = req.body;
      jsonfile.writeFileSync(configFile, req.body);
      return res.status(200);
    }
    else
      console.log("The config file is not correct.");
});

// ===================
// BOARDS ROUTE
// ===================

app.get('/boards', function(req,res) {
    if(boards)
      return res.status(200).send(boards);
    else
      console.log("No boards file.");
});

app.post('/boards', function(req,res) {
    if(req.body) {
      boards = req.body;
      jsonfile.writeFileSync(boardsFile, req.body);
      return res.status(200);
    }
    else
      console.log("The board file is not correct.");
});

// ===================
// LAUNCH SERVER
// ===================

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
