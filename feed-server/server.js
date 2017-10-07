const Feed = require('feed')
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const moment = require('moment');

const fakeData = require('./helpers/fakeData.js');

let app = require('express')();
let http = require('http').Server(app);
app.set('port', 5002);


app.use(bodyParser.json());

let feed = new Feed({
  title: 'Feed Title',
  description: 'This is my personal feed!',
  id: 'http://example.com/',
  link: 'http://example.com/',
  image: 'http://example.com/image.png',
  favicon: 'http://example.com/favicon.ico',
  copyright: 'All rights reserved 2013, John Doe',
  updated: new Date(2013, 06, 14), // optional, default = today
  generator: 'awesome', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://example.com/json',
    atom: 'https://example.com/atom',
  },
  author: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    link: 'https://example.com/johndoe'
  }
})

feed.addCategory('Technologie');

const posts = fakeData.generateFeed(20);



posts.forEach(post => {
  feed.addItem({
    title: post.title,
    id: post.url,
    link: post.url,
    description: post.description,
    content: post.content,
    author: [{
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      link: 'https://example.com/janedoe'
    }, {
      name: 'Joe Smith',
      email: 'joesmith@example.com',
      link: 'https://example.com/joesmith'
    }],
    contributor: [{
      name: 'Shawn Kemp',
      email: 'shawnkemp@example.com',
      link: 'https://example.com/shawnkemp'
    }, {
      name: 'Reggie Miller',
      email: 'reggiemiller@example.com',
      link: 'https://example.com/reggiemiller'
    }],
    date: post.date,
    image: post.image
  })
})

setInterval(function() {
  const newDate = moment(new Date());
  const post = fakeData.generateItem(newDate);
  feed.addItem({
    title: post.title,
    id: post.url,
    link: post.url,
    description: post.description,
    content: post.content,
    author: [{
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      link: 'https://example.com/janedoe'
    }, {
      name: 'Joe Smith',
      email: 'joesmith@example.com',
      link: 'https://example.com/joesmith'
    }],
    contributor: [{
      name: 'Shawn Kemp',
      email: 'shawnkemp@example.com',
      link: 'https://example.com/shawnkemp'
    }, {
      name: 'Reggie Miller',
      email: 'reggiemiller@example.com',
      link: 'https://example.com/reggiemiller'
    }],
    date: post.date,
    image: post.image
  })
}, 1500);

feed.addContributor({
  name: 'Johan Cruyff',
  email: 'johancruyff@example.com',
  link: 'https://example.com/johancruyff'
});

console.log(feed.rss2());



app.get('/rss', function(req,res) {
    if(feed)
      return res.status(200).send(feed.rss2());
    else
      console.log("No feed.");
});

app.get('/atom', function(req,res) {
    if(feed)
      return res.status(200).send(feed.atom1());
    else
      console.log("No feed.");
});

app.get('/json', function(req,res) {
    if(feed)
      return res.status(200).send(feed.json1());
    else
      console.log("No feed.");
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
