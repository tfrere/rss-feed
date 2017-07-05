<template>
  <div class="content">
    <fieldset v-bind:class="{'-has-tag': errors.has('title'), '-has-icon -large': true}">
      <i class="icon -lock"></i>
      <label>Title</label>
      <input name="title" v-validate.initial="'required|alpha_num'" v-model="feed.title" type="text" placeholder="Title" />
      <div v-show="errors.has('title')" class="tag visible -line-danger -large -top -pointing">
        <span>{{ errors.first('title') }}</span>
      </div>
    </fieldset>
    <fieldset v-bind:class="{'-has-tag': errors.has('url'), '-has-icon -large': true}">
      <i class="icon -lock"></i>
      <label>Url</label>
      <input name="url" v-validate.initial="'required|url'" v-model="feed.url" type="text" placeholder="Ex: 'trump'" />
      <div v-show="errors.has('url')" class="tag visible -line-danger -large -top -pointing">
        <span>{{ errors.first('url') }}</span>
      </div>
    </fieldset>
    <button :disabled="errors.any()" v-on:click="postFeed" class="button -success">Validate</button>
  </div>
</template>

<script>
  /* eslint-disable */
  import configProvider from '../api/configProvider.js';

  const defaultFeed = {
      title: '',
      url: '',
      type: 'rss',
      board: 'design',
      refreshRate: '20',
      filter: null,
      isImage: true,
      articles: null
  };

  export default {
    name: 'feedForm',
    props: {
      reqType: {
        type: String,
        default: "post"
      },
      close: {
        type: Function
      },
      config: {
        type: Array
      },
      feed: {
        type: Object,
        default: function() {
          return defaultFeed;
        }
      }
    },
    methods: {
      postFeed: function() {
        let self = this;
        console.log(this.config);
        if (self.reqType == "post") {
          self.config.map(function(board) {
            if(board.title == self.feed.board)
            {
              console.log(self.feed);
              board.feeds.push(self.feed);
              configProvider.postConfig(self.config, function(data) {
                console.log(self);
                self.close();
              });
            }
          });
        }
        else {
          configProvider.postConfig(self.config, function(data) {
            self.close();
          });
        }
      }
    },
    created: function() {
      //console.log("Feed -> ", this.feed);
    }
  };
</script>

<style>
  fieldset {
    display: block;
  }
</style>
