<template>
  <div class="column-wrapper">
    <div class="column">
      <div class="list-head">
        <h5 class="list-head-title">
          {{ feed.title }}
        </h5>
        <div class="list-head-interaction">
          <i class="icon -cross list-head-interaction-icon" v-on:click="deleteFeed"/>
          <i class="icon -cog list-head-interaction-icon" v-on:click="openModal"/>
        </div>
     </div>
       <svg class="bg" width="250" height="1">
         <path :d="headerPath" fill="rgba(0,0,0,0.05)"></path>
       </svg>
       <!-- :style="contentPosition" -->
       <ul :style="contentPosition" @mousedown="startDrag" @touchstart="startDrag"
       @mousemove="onDrag" @touchmove="onDrag"
       @mouseup="stopDrag" @touchend="stopDrag" @mouseleave="stopDrag" class="list" v-bind:class="{ loading: isLoading, error: isError }">
         <Item v-for="item in content" :key="item" :item="item" />
         <li v-if="isError" class="item item--error -headless">
           <h3 class="item--error-title">Error</h3>
         </li>
       </ul>
    </div>
    <Modal ref="modal" :open="openModal">
      <FeedForm ref="feedForm" reqType="put" :config="config" :feed="feed" :close="closeModal"/>
    </Modal>
  </div>
</template>

<script>
  /* eslint-disable */
  import VueResource from 'vue-resource';
  import Vue from 'vue';
  import dynamics from 'dynamics.js';
  import feedProvider from '../api/feedProvider.js';
  import configProvider from '../api/configProvider.js';
  import jsonToParams from '../helpers/jsonToParams.js';

  const width = 250;
  const height = 1;

  export default {
    name: 'list',
    props: ['feed', 'config'],
    data: () => {
      return {
        content: null,
        isLoading: true,
        isError: false,
        dragging: false,
        // quadratic bezier control point
        c: { x: height, y: height },
        // record drag start point
        start: { x: 0, y: 0 }
      }
    },
    computed: {
      headerPath: function () {
        return 'M0,0 L' + width + ',0 ' + width + ','+ height +
          'Q' + this.c.x + ',' + this.c.y +
          ' 0,'+ height
      },
      contentPosition: function () {
        var dy = this.c.y - height
        var dampen = dy > 0 ? 2 : 4
        return {
          transform: 'translate3d(0,' + dy / dampen + 'px,0)'
        }
      }
    },
    sockets: {
      listIsUpdated: function(val) {
        if (this.feed && val.feedName == this.feed.title && val.board == this.feed.board)
          this.content.unshift(val);
      }
    },
    methods: {
      startDrag: function (e) {
        e = e.changedTouches ? e.changedTouches[0] : e
        this.dragging = true
        this.start.x = e.pageX
        this.start.y = e.pageY
      },
      onDrag: function (e) {
        e = e.changedTouches ? e.changedTouches[0] : e
        if (this.dragging) {
          this.c.x = height + (e.pageX - this.start.x)
          // dampen vertical drag by a factor
          var dy = e.pageY - this.start.y
          var dampen = dy > 0 ? 1.5 : 4
          this.c.y = height + dy / dampen
        }
      },
      stopDrag: function () {
        let self = this;
        if (this.dragging) {
          this.dragging = false;
          window.setTimeout(function(){
            self.update();
          }, 500);
          dynamics.animate(this.c, {
            x: height,
            y: height
          }, {
            type: dynamics.spring,
            duration: 700,
            friction: 280
          })
        }
      },
      pause: function() {
      },
      deleteFeed: function() {
        let self = this;
        self.config.map(function(board) {
          if(board.title == self.feed.board)
          {
            board.feeds.map(function(feed, i) {
              if (feed.title == self.feed.title) {
                board.feeds.splice(i, 1);
                configProvider.putConfig(self.config, function(data) {
                  console.log("Feed -> Deleted normally");
                });
              }
            });
          }
        });
      },
      openModal: function() {
        this.$refs.modal.openModal();
      },
      closeModal: function() {
        console.log("closeCalledFromList");
        this.$refs.modal.closeModal();
      },
      update: function() {
        let self = this;
        self.isLoading = true;
        self.isError = false;


        let param = jsonToParams({
          type: self.feed.type,
          url: self.feed.url
        });
        feedProvider.getFeed(param, function(data) {
          //console.log(data);
          if(data != "error") {
            self.content = data;
            self.isLoading = false;
          }
          else {
            self.isLoading = false;
            self.isError = true;
          }
        });
      }
    },
    created: function() {
      let self = this;
      self.update();
    }
  };
</script>

<style lang="scss">

  // DRAG & DROP SVG
  .bg {
    position: absolute;
    display: block;
    overflow: visible!important;
    z-index: 998;
    top: 75px;
  }

  .column-wrapper {
    display: inline-block;
    width: 250px;
    height: 100%;
    position: relative;
  }
  .column {
    height: 100%;
  }
  .column h5 {
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .list-wrapper {
    height: 100%;
  }
  .list-head {
  }
  .list-head-interaction {
    float:right;
    margin-top: 8px;
    margin-right: 4px;
    display: inline;
  }
  .list-head-title {
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    z-index: 999;
    position: relative;
  }
  .list-head-interaction-icon {
    font-size: 2rem;
    color: lightgrey;
    cursor: pointer;
    z-index: 999;
    opacity: 0;
    position: relative;
  }
  .column {
    &:hover .list-head-interaction-icon {
      opacity: 1;
    }
  }
  .list .item--error {
    height: 100%;
    .item--error-title {
      vertical-align: middle;
      line-height: 75vh;
      text-align: center;
      margin: 0;
    }
  }
  .list {
    border-right: 1px solid #bbb;
    height: 100%;
    white-space: normal;
    overflow-y: scroll;
  }
</style>
