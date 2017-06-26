<template>
  <li class="item -headless">
     <div class="content">
        <a v-bind:href="item.link" class="title" target="_blank">{{ item.title }}</a>
        <div class="date">{{ item.date }}</div>
        <div class="creator">{{ item.creator }}</div>
        <div v-html="item.content"></div>
     </div>
  </li>
</template>

<script>
  export default {
    name: 'item',
    props: ['item'],
  };
</script>

<style>
  .list img {
      display: block;
      max-width:100%;
      width: auto;
      height: auto;
  }
</style>
