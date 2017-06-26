const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
const jsonfile = require('jsonfile');
const fetch = require("node-fetch");
const moment = require("moment");
const htmlToText = require('html-to-text');

const configFile = "./data/config.json";

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5001));
app.use(cors());

const config = jsonfile.readFileSync(configFile);

app.get('/config', function(req,res) {
    if(config)
      return res.status(200).send(config);
    else
      exit();
});

app.get('/feed', function(req,res) {

  const feedUrl = req.param("url");
  const domain = "https://query.yahooapis.com/v1/public/yql?format=json&q=";
  const request = 'SELECT * FROM feednormalizer WHERE output="rss_2.0" AND url ="' + feedUrl + '" LIMIT ' + 5;
  const url = domain + encodeURIComponent(request);

  console.log("=========");
  console.log("ROUTE : /feed");
  console.log("ENCODED QUERY URL : " + url);

  // console.log("https://api.github.com/users/tfrere");
  // console.log('https://randomuser.me/api');
  // console.log(url);
  //https://twitrss.me/twitter_user_to_rss/?user=[USERNAME]
  //http://twitrss.me/twitter_search_to_rss/?term=[SEARCH TERM]

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let feed = [];
      // if YQL is up
      if (data.query && data.query.results) {
        // if YQL is responding correcly
        if (data.query.results.rss && data.query.results.rss.channel) {

          const test = data.query.results.rss.channel.item;
          feed.status = "success";

          test.map(function(article, i) {
            let content = htmlToText.fromString(article.description, {
               wordwrap: 30
            });
            content = content.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            feed.push({
              title: article.title,
              content: content,
              date: moment(article.date).fromNow(),
              link: article.link,
              creator: article.creator,
              status: article.status
            });
            if (test.length == i)
              return feed;
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
      if (feed.status == "success")
        res.status(200).send(feed);
      else
        res.status(500).send("YQL doesn't suppor this feed");
    })
    .catch(error => {
      console.log(error);
    });


});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
