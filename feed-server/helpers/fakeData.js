const moment = require("moment");
const sentencer = require("sentencer");
const generateName = require('node-random-name');

module.exports = {
  randomIntFromInterval: function(min,max) { return Math.floor(Math.random(23)*(max-min+1)+min); },
  isFreshContent: function(date) {
    const today = moment(new Date());
    const publishDate = moment(date).add(7, 'day');
    if (today < publishDate)
      return true;
    else
      return false;
  },
  generateFeedName: function() {
    const names = [
      "design",
      "tech",
      "society",
      "art",
      "sport",
      "music",
      "poney",
    ];
    return names[this.randomIntFromInterval(0,names.length - 1)];
  },
  generateTitle: function() {
    const titles = [
      sentencer.make("This title has {{ a_noun }} and {{ an_adjective }} {{ noun }} in it."),
      sentencer.make("Drunk, this guy has {{ a_noun }} with {{ an_adjective }} {{ noun }}."),
      sentencer.make("Someone who's got {{ a_noun }} with a {{ an_adjective }} {{ noun }}."),
      sentencer.make("Another one, he's {{ an_adjective }}."),
      sentencer.make("A guy, he's {{ an_adjective }}."),
      sentencer.make("I'm out of {{ an_adjective }} {{ noun }}, please help me."),
      sentencer.make("These {{ noun }}s are the {{ an_adjective }} {{ noun }}.")
    ];
    return titles[this.randomIntFromInterval(0,titles.length - 1)];
  },
  generateItem: function(publishDate) {
    return {
      title: this.generateTitle(),
      content: this.generateTitle(),
      description: this.generateTitle(),
      image: "http://blog.mondediplo.net/local/cache-vignettes/L890xH594/alphabet-morozov-8f255.jpg",
      date: publishDate.toDate(),
      url: "#",
    };
  },
  generateFeed: function() {
    let feed = [];
    const numberOfItems = this.randomIntFromInterval(5, 15);

    for(var i = 0; i <= numberOfItems; i++) {
      const newDate = new Date();
      const publishDate = moment(newDate).add(-i * 2, 'day');
      feed.push(this.generateItem(publishDate));
    }
    return feed;
  }
}
