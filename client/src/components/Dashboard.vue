<template>
  <div class="dashboard" v-bind:class="{ loading: isLoading }">
    <div class="head-bar">
      <button class="button refresh-button" ><i class="icon -house"></i></button>
      <button class="button refresh-button" ><i class="icon -house"></i></button>
      <button class="button refresh-button" ><i class="icon -house"></i></button>
    </div>
    <Board v-for="subject in subjects" :key="subject" :subject="subject" />
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
        subjects: null
      }
    },
    methods: {
      update: function() {
        let self = this;
        configProvider.getConfig(function(data) {
          self.subjects = data;
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
  .dashboard.loading {
    overflow: hidden;
  }
</style>
