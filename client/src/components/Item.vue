<template>
  <li class="item -headless">
     <a v-bind:href="item.link" target="_blank" class="content">
        <a class="title">{{ item.title }}</a>
        <div class="date">{{ item.date }}</div>
        <!-- <div class="creator">{{ item.creator }}</div> -->
        <!-- <div v-html="item.content"></div> -->
     </a>
  </li>
</template>

<script>
  export default {
    name: 'item',
    props: ['item'],
  };
</script>

<style>
  .title {
    font-weight: bold;
    color: red;
  }
  .list img {
      display: block;
      max-width:100%;
      width: auto;
      height: auto;
  }
</style>
