<template>
  <transition name="fade">
    <li v-bind:class="{ fresh: item.isFreshContent, new: item.isNew, 'item -headless': true }">
       <a v-on:click="openItem" target="_blank" class="content">
         <div v-bind:class="{ 'color-label': true, fresh: item.isFreshContent, new: item.isNew}"></div>
         <div class="date">{{ item.date }}</div>
          <a class="title">{{ item.title }}</a>
          <img v-if="isImage" v-bind:src="item.image"/>
          <div v-if="isAuthor" class="creator">{{ item.creator }}</div>
          <div v-if="isDesc" v-html="item.content"></div>
       </a>
    </li>
  </transition>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'item',
    props: ['item', 'isAuthor', 'isImage', 'isDesc'],
    methods: {
      openItem: function() {
        window.open(this.item.link, '_blank');
      }
    }
  };
</script>

<style lang="scss">

</style>
