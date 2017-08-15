const moment = require("moment");
const fetch = require("node-fetch");

const tools = require('../helpers/tools.js');
const devTools = require('../helpers/dev-tools.js');

module.exports = {

  init: function(context) {

    const randomFeeds = devTools.generateFeeds(context.boards, 20);

    if (context.isFakeData) {
      context.app.get('/feed', function(req,res) {
        const index = tools.hashFromString(req.param("url"));
        res.status(200).send(randomFeeds[index % 2]);
      });
    }
    else {
      context.app.get('/feed', function(req,res) {

        const feedUrl = req.param("url");
        const domain = "https://query.yahooapis.com/v1/public/yql?format=json&q=";
        const request = 'SELECT * FROM feednormalizer WHERE output="rss_2.0" AND url ="' + feedUrl + '"';
        const url = domain + encodeURIComponent(request);

        fetch(url)
        .then(response => response.json())
        .then(data => {

          console.log("=========");
          console.log("ROUTE : /feed");
          console.log("URL : " + feedUrl);

          let feed = [];
          // if YQL is up
          if (data.query && data.query.results) {
            // if YQL is responding correcly
            if (data.query.results.rss && data.query.results.rss.channel) {

              const articles = data.query.results.rss.channel.item;
              feed.status = "success";
              articles.map(function(article, i) {
                if (i <= context.config.articleCountLimit || i <= articles.length) {
                  feed.push({
                    title: article.title,
                    content: tools.sanitizeContent(article.description),
                    image: tools.firstImageUrl(article.description),
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
              feed.status = "error";
              console.log("RESPONSE : 500 - YQL doesn't suppor this feed\n=========\n");
            }
          }
          else {
            feed.status = "error";
            console.log("RESPONSE : 500 - YQL doesn't suppor this feed\n=========\n");
          }
          return feed;
        })
        .then(feed => {
          // console.log(feed);
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

  }

};
