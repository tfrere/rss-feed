<template>
  <div class="column">
     <h5>{{ feed.title }}</h5>
     <button class="button refresh-button" v-on:click="refresh"><i class="icon -refresh"></i></button>
     <ul class="list" v-bind:class="{ loading: isLoading, error: isError }">
       <Item v-for="item in content" :key="item" :item="item" />
     </ul>
  </div>
</template>

<script>
  /* eslint-disable */
  import VueResource from 'vue-resource';
  import Vue from 'vue';
  import feedProvider from '../api/feedProvider.js';

  const jsonToParams = function(obj) {
    let str = "";
    for (var key in obj) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
  }

  export default {
    name: 'list',
    props: ['feed'],
    data: () => {
      return {
        content: null,
        isLoading: true,
        isError: false,
      }
    },
    methods: {
      refresh: function() {
        this.update();
      },
      pause: function() {
      },
      update: function() {
        let self = this;
        self.isLoading = false;
        self.isError = false;

        let param = jsonToParams({
          type: self.feed.type,
          url: self.feed.url
        });
        console.log(param);
        feedProvider.getFeed(param, function(data) {
          self.content = data;
          self.isLoading = false;
        });
      }
    },
    created: function() {
      let self = this;
      self.update();
      // refreshRate
      // setInterval(function goFaster() {
      //   self.update();
      // }, self.feed.refreshRate * 1000);
      document.addEventListener('refreshAll', this.refresh, false);
    }
  };
</script>

<style>
  .column {
    display: inline-block;
    width: 250px;
    height: 100%;
  }
  .column h5 {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .error {
    display: none;
  }
  .list-wrapper {
    height: 100%;
  }
  .list {
    border-right: 1px solid #bbb;
    float:left;
    height: 100%;
    white-space: normal;
    overflow-y: scroll;
  }
</style>
