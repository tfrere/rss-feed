const Feed = require('feed')


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

feed.addCategory('Technologie')


const posts = [
  {
    title: "toto",
    url: "http://toto.fr",
    descrition: "totototo",
    content: "titititi",
    date: new Date(),
    image: "http://tfrere.fr/tamere.jpg"
  },
  {
    title: "toto1",
    url: "http://toto.fr",
    descrition: "totototo",
    content: "titititi",
    date: new Date(),
    image: "http://tfrere.fr/tamere.jpg"
  },
  {
    title: "toto2",
    url: "http://toto.fr",
    descrition: "totototo",
    content: "titititi",
    date: new Date(),
    image: "http://tfrere.fr/tamere.jpg"
  },
  {
    title: "toto3",
    url: "http://toto.fr",
    descrition: "totototo",
    content: "titititi",
    date: new Date(),
    image: "http://tfrere.fr/tamere.jpg"
  },
  {
    title: "toto4",
    url: "http://toto.fr",
    descrition: "totototo",
    content: "titititi",
    date: new Date(),
    image: "http://tfrere.fr/tamere.jpg"
  }
]

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

feed.addContributor({
  name: 'Johan Cruyff',
  email: 'johancruyff@example.com',
  link: 'https://example.com/johancruyff'
})


console.log(feed.rss2());
