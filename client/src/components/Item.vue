<template>
  <li v-bind:class="{ fresh: item.isFreshContent, 'item -headless': true }">
     <a v-on:click="openItem" target="_blank" class="content">
        <a class="title">{{ item.title }}</a>
        <div class="date">{{ item.date }}</div>
        <img v-if="item.image" v-bind:src="item.image"/>
        <!-- <div class="creator">{{ item.creator }}</div> -->
        <!-- <div v-html="item.content"></div> -->
     </a>
  </li>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'item',
    props: ['item'],
    methods: {
      openItem: function() {
        window.open(this.item.link, '_blank');
      }
    }
  };
</script>

<style>
  .fresh {
    background-color: #eaeaea!important;
  }
  .title {
    font-weight: bold;
    color: red;
    user-select: none;
  }
  .list img {
      display: block;
      max-width:100%;
      width: auto;
      height: auto;
  }
</style>
