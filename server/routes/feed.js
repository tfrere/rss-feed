const moment = require("moment");
const fetch = require("node-fetch");

const tools = require('../helpers/tools.js');
const devTools = require('../helpers/dev-tools.js');
const Feed = require('../helpers/rss-to-json.js');

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

        console.log("route");

        Feed.load(req.param("url"), function(err, rss) {
          let feed = [];
          if (rss && rss.items) {
            console.log("length", rss.items.length);
            rss.items.map(function(item, index) {
              feed.push({
                title: item.title,
                content: tools.sanitizeContent(item.description),
                image: tools.firstImageUrl(item.description),
                date: moment(item.created).fromNow(),
                isFreshContent: tools.isFreshContent(item.created),
                link: item.link,
                creator: item.creator,
                status: "success"
              });
              console.log(rss.items.length, index);
              if (rss.items.length == index + 1) {
                console.log(1);
                res.status(200).send(feed);
              }
            });
          }
          else {
            res.status(500).send(rss);
          }
        });

      });
    }

  }

};
