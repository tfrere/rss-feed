<template>
  <div class="dashboard" v-bind:class="{ loading: isLoading }">
    <Board v-for="board in boards" :key="board" :config="boards" :board="board" />
  </div>
</template>

<script>
  /* eslint-disable */
  import VueResource from 'vue-resource';
  import Vue from 'vue';
  import configProvider from '../api/configProvider.js';

  export default {
    name: 'dashboard',
    data: () => {
      return {
        isLoading: true,
        boards: null
      }
    },
    sockets: {
      connect: function() {
        console.log('socket connected')
      },
      // listIsUpdated: function(val) {
      //   let self = this;
      //   self.boards.map(function(board) {
      //     if (board.title == val.board) {
      //       board.feeds.map(function(feed) {
      //         if (feed.title)
      //       });
      //     }
      //   });
      //   if (this.feed && val.feedName == this.feed.title && val.board == this.feed.board)
      //     this.content.unshift(val);
      // }
    },
    methods: {
      toogleEditMode: function() {
        this.isEditMode = !this.isEditMode;
      },
      update: function() {
        let self = this;
        configProvider.getConfig(function(data) {
          self.boards = data;
          self.isLoading = false;
        });
      },
  		refreshAll: function() {
        this.refreshAll = document.createEvent('Event');
        this.refreshAll.initEvent('refreshAll', true, true);
        document.dispatchEvent(this.refreshAll);
      }
    },
    created: function() {
      this.update();
    },

  };

</script>

<style>
  html, body, #app {
    height: 100%;
    min-width: 100%;
  }
  .head-bar h3 {
    margin: 0;
  }
  .head-bar {
    position: fixed;
    padding: 5px;
    background-color: #fbfbfb;
    border-right: 1px solid #f1f1f1;
    border-left: 1px solid #f1f1f1;
    border-top: 1px solid #f1f1f1;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 165px;
    z-index: 99999999;
  }
  .dashboard {
    height: 100%;
    min-width: 100%;
    background-color: #fafafa;
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .dashboard * {
    user-select: none;
  }
  .dashboard.loading {
    overflow: hidden;
  }
</style>
