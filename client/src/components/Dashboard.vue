<template>
  <div class="dashboard" v-bind:class="{ loading: isLoading }">
    <div class="head-bar">
      <button class="button refresh-button" v-on:click="refreshAll"><i class="icon -refresh"></i></button>
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
        console.log(124);
        configProvider.getConfig(function(data) {
          self.subjects = data;
          self.isLoading = false;
        });
      },
  		refreshAll: function() {
        this.refreshAll = document.createEvent('Event');
        this.refreshAll.initEvent('refreshAll', true, true);
        console.log(this.refreshAll);
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
  .head-bar {
    position:fixed;
    top:0;
    left:0;
    width: 100%;
    height: 50px;
    background-color: #fafafa;
  }
  .dashboard {
    height: 100%;
    padding-top: 50px;
    min-width: 100%;
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }
  .dashboard.loading {
    overflow: hidden;
  }
</style>
