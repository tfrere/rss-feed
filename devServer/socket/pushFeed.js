const moment = require("moment");
const fetch = require("node-fetch");

const tools = require('../helpers/tools.js');
const devTools = require('../helpers/dev-tools.js');

module.exports = {
  init: function(context) {

    context.io.on('connection', function(socket) {
      console.log("socket connected");
      context.boards.map(function(board) {
        board.feeds.map(function(feed) {
          setInterval(function () {

            const newDate = new Date();
            const publishDate = moment(newDate).add(-50, 'second');
            const item = devTools.generateItem(context.boards, publishDate);
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

  }
};
