const fetch = require("node-fetch");




const tools = require('../helpers/tools.js');
const devTools = require('../helpers/dev-tools.js');

const Feed = require('../helpers/rss-to-json.js');

const FeedHelper = require("../helpers/feedparser.js");


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

        let url = req.param("url");
        let feedHelper = FeedHelper(url).then((data) => {
          res.status(200).send(data);
        }).catch((err) => {
          res.status(500).send(err.reason);
        });
      });
    }
  }
};
