const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
const jsonfile = require('jsonfile');
const fetch = require("node-fetch");
const moment = require("moment");

const tools = require('./helpers/tools.js');

const configFile = "./data/config.json";
const articleCountLimit = 10;

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5001));
app.use(cors());

let config = jsonfile.readFileSync(configFile);


const isDevMode = false;

const sampleFeedFile = "./data/sampleFeed.json";
const sampleFeedFile2 = "./data/sampleFeed2.json";
const sampleFeedFile3 = "./data/sampleFeed3.json";
const sampleFeedFile4 = "./data/sampleFeed4.json";

const sampleFeed = jsonfile.readFileSync(sampleFeedFile);
const sampleFeed2 = jsonfile.readFileSync(sampleFeedFile2);
const sampleFeed3 = jsonfile.readFileSync(sampleFeedFile3);
const sampleFeed4 = jsonfile.readFileSync(sampleFeedFile4);

const sampleFeeds = [
  sampleFeed,
  sampleFeed2,
  sampleFeed3,
  sampleFeed4
];
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
      console.log(req.body);
      config = req.body;
      jsonfile.writeFileSync(configFile, req.body);
      return res.status(200).send("The config has been updated correctly !");
    }
    else
      console.log("The config file is not correct.");
});

// ===================
// FEED ROUTE
// ===================

if (isDevMode) {

  app.get('/feed', function(req,res) {
    const index = tools.hashFromString(req.param("url"));
    res.status(200).send(sampleFeeds[index % 4]);
  });

}
else {

  app.get('/feed', function(req,res) {

    const feedUrl = req.param("url");
    const domain = "https://query.yahooapis.com/v1/public/yql?format=json&q=";
    const request = 'SELECT * FROM feednormalizer WHERE output="rss_2.0" AND url ="' + feedUrl + '"';
    const url = domain + encodeURIComponent(request);

    fetch(url)
    .then(response => response.json())
    .then(data => {

      console.log("=========");
      console.log("ROUTE : /feed");
      console.log("ENCODED QUERY URL : " + url);

      let feed = [];
      // if YQL is up
      if (data.query && data.query.results) {
        // if YQL is responding correcly
        if (data.query.results.rss && data.query.results.rss.channel) {

          const articles = data.query.results.rss.channel.item;
          feed.status = "success";

          articles.map(function(article, i) {
            if (i <= articleCountLimit) {
              console.log(1);
              feed.push({
                title: article.title,
                content: tools.sanitizeContent(article.description),
                image: tools.getFirstImageUrl(article.description),
                date: moment(article.date).fromNow(),
                isFreshContent: tools.isFreshContent(article.date),
                link: article.link,
                creator: article.creator,
                status: article.status
              });
            }
            if (articles.length == i) {
              return feed;
            }
          });

          console.log("RESPONSE : 200\n=========\n");
        }
        else {
          console.log("RESPONSE : 500 - YQL doesn't suppor this feed\n=========\n");
          feed.status = "error";
        }
      }
      else {
        console.log("RESPONSE : 200 - Success\n=========\n");
        feed.status = "error";
      }
      return feed;
    })
    .then(feed => {
      console.log(feed);
      if (feed.status == "success")
      res.status(200).send(feed);
      else
      res.status(500).send("YQL doesn't suppor this feed");
    })
    .catch(error => {
      console.log("Timeout ou fetch error");
      //console.log(error);
    });


  });

}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
